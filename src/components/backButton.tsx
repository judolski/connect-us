"use client"; // If using app directory

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type BackButtonProps = {
  url: string;
};

export default function BackButton({ url }: BackButtonProps) {
  const router = useRouter();

  return (
    <Link href={url} className="flex items-center text-gray-500">
      <ChevronLeft className="w-5 h-5 mr-1" />
    </Link>
  );
}
