import Link from "next/link";
import UserForm from "./signupForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="w-full h-[98vh] sm:h-[90vh] overflow-y-auto p-4 shadow-lg rounded-md">
      <div className="w-full max-w-2xl mx-auto flex flex-col space-y-6 items-center p-6 ">
        <div className="flex justify-center items-center flex-col mb-6">
          <Image
            src="/images/connect-us-logo.png"
            width={100}
            height={100}
            alt="Connect logo"
          />
          <span className="text-lg text-center text-[#3257A9] font-bold">
            Hey there!
          </span>
          <span className="text-sm text-gray-500 font-semibold text-center">
            Sign up to explore
          </span>
        </div>

        <UserForm />

        <div className="flex items-center justify-center mt-3 text-[13px] gap-1">
          <span>Already have an account?</span>
          <Link className="text-red-600 font-medium" href={"/login"}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
