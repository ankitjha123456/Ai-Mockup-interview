"use client"
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { chatSession } from '@/utils/GeminiAiModel';
import { LoaderCircle } from 'lucide-react';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/Schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { useRouter } from 'next/navigation';


function AddNewInterview() {
  const [openDialog,setOpenDialog] = useState(false);
  const [jobPosition,setJobPosition] = useState();
  const [jobDescription,setJobDescription] = useState();
  const [jobExperience,setJobExperience] = useState();
  const [loading,setLoading] = useState(false);
  const [JsonResponce,setJsonResponce] = useState([]);
  const router =useRouter();
  const {user}=useUser();
  const onSubmit=async(e)=>{
    setLoading(true)
    e.preventDefault()
    console.log(jobPosition,jobDescription,jobExperience);

    const InputPrompt="Job Position:"+jobPosition+", Job Description:"+jobDescription+", Year Of Experience:"+jobExperience+", Depends on Job Position,Job Description & Year of Experience give us 5 interview question along with answer in JSon format, Give us question and answer field On JSON";

    const result = await chatSession.sendMessage(InputPrompt);
    const MockJsonResp=(result.response.text()).replace('```json','').replace('```','')
    setJsonResponce(MockJsonResp);

    if(MockJsonResp){

      const resp=await db.insert(MockInterview)
      .values({
       mockId:uuidv4(),
       jsonMockResp:MockJsonResp,
       jobPosition:jobPosition,
       jobDesc:jobDescription,
       jobExperience:jobExperience,
       jobExperience:jobExperience,
       createdBy:user?.primaryEmailAddress?.emailAddress,
       createdAt: moment().format('DD-MM-YYYY')
      }).returning({mockId:MockInterview.mockId});
  
      console.log("Inserted ID:",resp)
      if(resp){
        setOpenDialog(false);
        router.push('/dashboard/interview/'+resp[0]?.mockId)
      }
    }else{
      console.log("Error Message show");
    }


    setLoading(false);
  }


  return (
    <div>
      <div className='p-10 border rounder-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'onClick={()=>setOpenDialog(true)}>
        <h2 className='font-bold text-lg text-center'
        
        >+ Add New</h2>
      </div>
      <Dialog open={openDialog}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle className='text-2xl'>Tell us more about your job interview</DialogTitle>
      <DialogDescription>
        <form onSubmit={onSubmit}>
        <div>
          <h2>Add details about your job position/role, job description and year of ecperiance</h2>
          <div className='mt-7 my-3'>
            <label>Job role/job Position</label>
            <Input  placeholder ="Ex. Full Stack Developer" required
            onChange={(event)=>setJobPosition(event.target.value)}
            />
          </div>
          <div className='my-3'>
            <label>Job Description/Tech Stack(In short)</label>
            <Textarea placeholder ="Ex. Html,css,javascript,ReactJs,mongodb" required
            onChange={(event)=>setJobDescription(event.target.value)}
            />
          </div>
          <div className='my-3'>
            <label>Years of Experience</label>
            <Input  placeholder ="Ex.5 " type="number" required max="20"
            onChange={(event)=>setJobExperience(event.target.value)}
            />
          </div>
        </div>
        <div className='flex gap-5 justify-end'>
          <Button type="button" variant ="ghost" onClick={()=>setOpenDialog(false)}>Cancel</Button>
          <Button type="submit" disable={loading} >
            {loading?
            <>
            <LoaderCircle className='animate-spin'/>Genrating from AI
            </>:'Start Interview'}
            </Button>
        </div>
        </form>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

    </div>
  )
}

export default AddNewInterview
