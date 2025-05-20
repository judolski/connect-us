import Link from "next/link";
import LoginForm from "./loginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full flex flex-col space-y-6 items-center sm:max-w-md h-screen sm:h-fit p-6 bg-white shadow-lg rounded-md">
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
            Sign in to continue
          </span>
        </div>

        <LoginForm />

        <div className="flex items-center justify-center mt-3 text-[13px] gap-1">
          <span>Don't have an account?</span>
          <Link className="text-red-600 font-medium" href={"/create-account"}>
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
