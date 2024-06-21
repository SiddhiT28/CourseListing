import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '@/firebase/db';
import { collection, getDocs } from 'firebase/firestore';
import { useStore } from '@/store/userStore';

export default function Home() {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const searchQuery = useStore((s) => s.searchQuery);

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, 'courses'));

    const data = [];

    querySnapshot.forEach((doc) => {
      const payload = {
        id: doc.id,
        ...doc.data(),
      };

      data.push(payload);
    });

    setList(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return;

  return (
    <section className="flex flex-col gap-4 w-full">
      <ol className="flex flex-col gap-8 pb-3">
        {searchQuery !== ''
          ? list
              .filter(
                (s) =>
                  s.name.includes(searchQuery) ||
                  s.instructor.includes(searchQuery)
              )
              .map((data) => {
                return (
                  <li key={data.id}>
                    <Link to={`details/${data.id}`}>
                      <Card>
                        <CardHeader className="flex flex-row justify-between">
                          <div className="flex flex-col gap-2 w-max">
                            <Badge className="w-max hover:bg-green-100 bg-green-100 text-green-500">
                              {data.enrollmentStatus}
                            </Badge>
                            <CardTitle>{data.name}</CardTitle>
                            <CardDescription>{data.instructor}</CardDescription>
                          </div>
                          <img
                            className="w-[200px] h-[100px] rounded-xl object-cover"
                            src={data.thumbnail}
                          />
                        </CardHeader>
                        <CardContent>
                          <div className="flex  gap-2">
                            <p>{data?.syllabus.length} weeks</p>
                            <Separator orientation="vertical" />
                            <p>{data.schedule}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </li>
                );
              })
          : list.map((data) => {
              return (
                <li key={data.id}>
                  <Link to={`details/${data.id}`}>
                    <Card>
                      <CardHeader className="flex flex-row justify-between">
                        <div className="flex flex-col gap-2 w-max">
                          <Badge className="w-max hover:bg-green-100 bg-green-100 text-green-500">
                            {data.enrollmentStatus}
                          </Badge>
                          <CardTitle>{data.name}</CardTitle>
                          <CardDescription>{data.instructor}</CardDescription>
                        </div>
                        <img
                          className="w-[200px] h-[100px] rounded-xl object-cover"
                          src={data.thumbnail}
                        />
                      </CardHeader>
                      <CardContent>
                        <div className="flex  gap-2">
                          <p>{data?.syllabus.length} weeks</p>
                          <Separator orientation="vertical" />
                          <p>{data.schedule}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </li>
              );
            })}
      </ol>
    </section>
  );
}
