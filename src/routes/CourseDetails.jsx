import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { auth, db } from '@/firebase/db';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, runTransaction } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { CaretSortIcon } from '@radix-ui/react-icons';

export default function CourseDetails() {
  const { courseId } = useParams();

  const navigate = useNavigate();

  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const [isEnrolling, setIsEnrolling] = useState(false);

  const handleCourseEnrollment = async () => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    setIsEnrolling(true);

    const courseDetailRef = doc(db, 'courses', courseId);

    const userRef = doc(db, 'users', auth.currentUser.uid);

    try {
      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) {
          throw 'Document does not exist!';
        }

        const payload = {
          id: courseId,
          progress: 0,
          completed: false,
        };

        const enrolledCourses = userDoc.data().enrolledCourses || [];

        const existingEnrolledCourses = enrolledCourses.findIndex(
          (course) => course.id === payload.id
        );

        if (existingEnrolledCourses === -1) {
          // If not found, add the course
          enrolledCourses.push(payload);
        } else {
          // If found, update the existing course details
          enrolledCourses[existingEnrolledCourses] = payload;
        }

        transaction.update(userRef, { enrolledCourses: enrolledCourses });
      });
    } catch (e) {
      console.log('User Transaction failed: ', e);
    }

    try {
      await runTransaction(db, async (transaction) => {
        const courseDoc = await transaction.get(courseDetailRef);
        if (!courseDoc.exists()) {
          throw 'Document does not exist!';
        }

        const payload = {
          id: auth.currentUser.uid,
          name: auth.currentUser.displayName,
          email: auth.currentUser.email,
        };

        const students = courseDoc.data().students || [];

        const existingStudentIndex = students.findIndex(
          (student) => student.id === payload.id
        );

        if (existingStudentIndex === -1) {
          // If not found, add the student
          students.push(payload);
        } else {
          // If found, update the existing student details
          students[existingStudentIndex] = payload;
        }

        console.log(students);

        transaction.update(courseDetailRef, { students: students });
        toast('Enrolled successfully!');

        setIsEnrolling(false);
      });
    } catch (e) {
      console.log('Transaction failed: ', e);
    }
  };

  const fetchData = async () => {
    const docRef = await doc(db, 'courses', courseId);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setData(docSnap.data());
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          <img className="w-full  lg:hidden rounded-xl" src={data.thumbnail} />

          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-3xl font-bold">{data.name}</h2>
              <p className="font-medium text-gray-600">by {data.instructor}</p>
              <p className="mt-4">{data.description}</p>
            </div>

            <div className="flex gap-3">
              <Badge className="w-max hover:bg-green-100 bg-green-100 text-green-500">
                {data.enrollmentStatus}
              </Badge>
              <Badge className="w-max hover:bg-green-100 bg-green-100 text-green-500">
                {data.location}
              </Badge>
              <Badge className="w-max hover:bg-white border border-gray-300 shadow-none bg-white-100 text-black">
                {data.syllabus.length} weeks duration
              </Badge>
            </div>

            <div className="flex flex-col gap-2 items-start">
              {data.enrollmentStatus === 'Open' && (
                <Button disabled={isEnrolling} onClick={handleCourseEnrollment}>
                  {auth.currentUser ? 'Enroll' : 'Login to enroll'}
                </Button>
              )}

              <p className="font-medium text-lg">Schedule</p>
              <p>{data.schedule}</p>
            </div>
          </div>

          <img
            className="w-1/3 hidden lg:block rounded-xl"
            src={data.thumbnail}
          />
        </div>
        <p className="font-medium text-lg">Syllabus</p>
        <ul className="flex flex-col gap-4 pb-10">
          {data.syllabus.map((item, i) => (
            <li
              key={`${courseId}-${i}`}
              className="flex flex-col gap-1 p-4 border rounded-xl"
            >
              <Collapsible className="w-full">
                <CollapsibleTrigger className="w-full flex justify-between text-start">
                  <div>
                    <p>Week {i + 1}</p>
                    <p className="font-bold text-xl">{item.topic}</p>
                  </div>

                  <CaretSortIcon className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <p className="mt-2 text-xl">{item.content}</p>
                </CollapsibleContent>
              </Collapsible>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
