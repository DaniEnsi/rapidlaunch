import { getUser } from "@/server/auth";
import  { StepperDemo } from "@/app/(app)/_components/new-user-form";

export async function NewUserSetup() {
    const user = await getUser();


    if (!user?.isNewUser) {
        return null;
    }
    return (
        <div className="fixed inset-0 flex h-screen w-screen flex-col items-center justify-center bg-black/80">
            <div className="w-full max-w-xl">
                <StepperDemo user={user} />
            </div>
        </div>
    );
}
