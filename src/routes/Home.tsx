import { useEffect, useState } from "react";
import { RegisterForm, SignInForm } from "../components/Login";
import { RootState } from "../store/index";
import { useSelector, TypedUseSelectorHook } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Home(){
    const [ viewRegister, setViewRegister ] = useState(false);
    const navigate = useNavigate();
    const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
    const user = useTypedSelector((state) => state.user);

    const toggleView = () => {
        setViewRegister((prev) => !prev);
    };



    useEffect(() => {
        if(user.id) navigate("/browse");
    }, [user])

    return(
        <>
            <div className="flex items-center justify-around py-8">
                <div className="">

                {viewRegister? (
                    <RegisterForm handleToggle={toggleView} />
                ):(
                    <SignInForm handleToggle={toggleView} />
                )}
                </div>
            </div>
        </>
    )
}