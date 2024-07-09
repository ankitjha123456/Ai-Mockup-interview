"use client"
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/Schema'
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
import {  ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function Feedback({params}) {

    const [feedbackList,setFeedbackList]=useState([]);


    useEffect(()=>{
        GetFeedback();
    },[])

    const GetFeedback=async()=>{
        const result = await db.select().from(UserAnswer).where(eq(UserAnswer.mockIdRef,params.interviewId)).orderBy(UserAnswer.id);
        console.log(result);
        setFeedbackList(result);
    }
  return (
    <div className='p-10'>
      <h2 className='text-3xl font-bold text-green-500'>Congratulations</h2>
      <h2 className='font-bold text-2xl'>Here is your Interview feedback</h2>
      <h2 className='text-blue-700 text-lg my-3'>Your overall interview <strong>7/10</strong></h2>

      <h2 className='text-sm text-gray-500'>find below interview question with correct answer, Your answer and feedback for improvement</h2>
      
      {feedbackList&&feedbackList.map((item,index)=>(
        <Collapsible key={index} className='mt-7'>
        <CollapsibleTrigger className='p-2 bg-secondary rounded-lg flex justify-between my-2 text-left gap-7 w-full'>
        {item.question} <ChevronsUpDown/>
        </CollapsibleTrigger>
        <CollapsibleContent>
        <div className='flex flex-col gap-2'>
            <h2 className='text-red-500 p-2 border rounde-lg'><strong>Rating:</strong>{item.rating}</h2>
            <h2 className='p-2 border rounde-lg bg-red-50 text-sm text-red-900'><strong>Your Answer:</strong>{item.userAns}</h2>
            <h2 className='p-2 border rounde-lg bg-green-50 text-sm text-green-900'><strong>Correct Answer:</strong>{item.correctAns}</h2>
            <h2 className='p-2 border rounde-lg bg-blue-50 text-sm text-blue-900'><strong>Feedback:</strong>{item.feedback}</h2>
        </div>
        </CollapsibleContent>
      </Collapsible>

      ))}
       <Link href={'/dashboard'}>
      <Button className="mt-10">Go to Home </Button>
      </Link>
    </div>
  )
}

export default Feedback
