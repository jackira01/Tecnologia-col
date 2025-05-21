'use client';

import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';

const AuthFormGoogle = () => {
  return (
    <div className="flex justify-center mt-52">
      <button
        onClick={() => signIn('google')}
        type="button"
        className="cursor-pointer text-black flex gap-2 items-center bg-white px-4 py-2 rounded-lg font-medium text-xl hover:bg-zinc-300 transition-all ease-in duration-200"
      >
        <FcGoogle size={40} />
        Continuar con Google
      </button>
    </div>
  );
};

export default AuthFormGoogle;
