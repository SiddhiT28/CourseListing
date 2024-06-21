import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { auth, db } from '@/firebase/db';
import { CheckIcon } from '@radix-ui/react-icons';
import { doc, getDoc, runTransaction } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const [data, setData] = useState();
  const [enrolledCourses, setEnrolledCourse] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (!auth.currentUser) return;

    const docRef = doc(db, 'users', auth.currentUser.uid);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();

      if (userData.enrolledCourses) {
        for (const course of userData.enrolledCourses) {
          const courseRef = doc(db, 'courses', course.id);
          const courseSnap = await getDoc(courseRef);

          if (courseSnap.exists()) {
            setEnrolledCourse((prev) => {
              const payload = {
                id: course.id,
                ...courseSnap.data(),
              };
              const existingData = prev.findIndex((i) => i.id === course.id);

              if (existingData === -1) {
                prev.push(payload);
              }

              return prev;
            });
          }
        }
      }

      setData(docSnap.data());
      setIsLoading(false);
    }
  };

  async function handleMarkComplete(courseId, length) {
    const userRef = doc(db, 'users', auth.currentUser.uid);

    try {
      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) {
          throw 'Document does not exist!';
        }

        const payload = {
          id: courseId,
          progress: length,
          completed: true,
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
        toast('Marked as complete');
      });
    } catch (e) {
      console.log('User Transaction failed: ', e);
    } finally {
      fetchData();
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return;

  if (!auth.currentUser) return;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Enrolled courses</h2>

      {!auth.currentUser && <Navigate to="/" />}

      <ol className="flex flex-col gap-4">
        {enrolledCourses.map((item) => {
          const enrolledDetails = data.enrolledCourses.find(
            (i) => i.id === item.id
          );

          return (
            <li
              className="border rounded-md p-4 flex flex-col md:flex-row  gap-8 justify-between items-start gap-1"
              key={item.id}
            >
              <div className="flex flex-col gap-4">
                <img className="w-[200px] rounded-xl" src={item.thumbnail} />
                <div>
                  <Badge className="w-max hover:bg-green-100 bg-green-100 text-green-500">
                    {item.enrollmentStatus}
                  </Badge>
                  <p className="text-xl my-1 font-medium">{item.name}</p>
                  <p>by {item.instructor}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center flex-col">
                  <p className="text-xs">Completed</p>

                  <p className="text-xl font-medium">
                    {enrolledDetails.progress} / {item.syllabus.length}
                  </p>
                </div>

                {enrolledDetails.completed ? (
                  <Button disabled>
                    <CheckIcon width={20} height={20} />
                    Completed
                  </Button>
                ) : (
                  <Button
                    onClick={() =>
                      handleMarkComplete(item.id, item.syllabus.length)
                    }
                  >
                    Mark as completed
                  </Button>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
