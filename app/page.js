import { Button } from "@/components/ui/button";

import Link from "next/link";
import Header from "./dashboard/_components/Header";
import {ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div>
        <Header/>

    <div className="flex justify-center items-center mt-20">
      
 
      <Link href={'/dashboard'}>
      <Button>Start Your Interview  <ArrowRight/> </Button>
      </Link>
      
    </div>
    </div>
  );
}
