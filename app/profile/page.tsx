import { currentUser } from "@clerk/nextjs/server";

export default async function ProfilePage() {
    const user = await currentUser();
    return (
        <div className='w-full py-8 flex flex-col'>
            
            {/* profile card */}
            <div className='bg-card border border-border rounded-lg p-4 max-w-xl'>
                <h1 className='font-medium text-xl'>Profile</h1>
                <p className='text-muted-foreground mt-2'>{user?.emailAddresses[0].emailAddress}</p>
                <p className='text-muted-foreground mt-2'>{user?.firstName} {user?.lastName}</p>
                <div className='w-12 h-12 aspect-square flex justify-center items-center bg-primary rounded-full overflow-hidden mt-2'>
                    <img src={user?.imageUrl || ''} alt={user?.username || ''} />
                </div>
            </div>
        </div>
    )
}