'use client'

interface AccountProps {
    user: {
        id: any
        objectId: string,
        username: string,
        name: string,
        bio: string,
        image: string
    };
    btnTitle: string
}
const AccountProfile = ({ user, btnTitle }: AccountProps) => {
    return (
        <div>AccountProfile</div>
    )
}

export default AccountProfile