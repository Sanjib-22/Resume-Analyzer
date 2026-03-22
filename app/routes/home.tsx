import Navbar from "~/components/Navbar"
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Your personal resume feedback" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const[resumes, setResumes] = useState<Resume[]>([]);
  const[loadingResumes, setLoadingResumes] = useState(false);

  useEffect(()=>{
    if(!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated])

  useEffect(()=> {
    const loadResume = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list('resume:*', true)) as KVItem[];
      const parsedResumes = resumes?.map((resume) => (
        JSON.parse(resume.value) as Resume
      ))
      console.log("parsedResumes", parsedResumes);
      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    } 
    loadResume();
  }, []);

  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />
    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Track your Appliction & Resume Ratings</h1>
        {!loadingResumes && resumes ?.length === 0 ?(
          <h2>No resumes found. Upload your first resume to get feedback.</h2>
        ):(
          <h2>Review your submissions and check AI-powered feedback.</h2>
        )}
      </div>
      {loadingResumes && (
        <div className="flex-col item-center justify-center">
          <img src="/images/resume-scan-2.gif" className="w-[200px]"/>
        </div>
      )}
          
      {!loadingResumes && resumes.length > 0 && (
        <div className="resumes-section">
          {resumes.map((resumes)=> (
        <ResumeCard key={resumes.id} resume={resumes}/>
      ))}
        </div>
      )}
      {!loadingResumes && resumes?.length === 0 && (
        <div className="flex-col items-center justify-center mt-10 gap-4">
          <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
            Upload Resume
          </Link>
        </div>
      )}
    </section>
  </main>
}
