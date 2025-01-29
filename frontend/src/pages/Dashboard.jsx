import { useRecoilValue } from "recoil";
import Appbar from "../components/Appbar"
import Balance from "../components/Balance"
import Users from "../components/Users"
import { tokenAtom, userAtom } from "../store/atoms";
import { useEffect, useState } from "react";
import { getBalance } from "../services/operations/transactionApi";


const Dashboard = () => {
    console.log("dashboard render");
    const [balance, setBalance] = useState("");
    const token = useRecoilValue(tokenAtom);
    const user = useRecoilValue(userAtom);
    

    //display balance in frontend
    useEffect(() => {
        const fetchBalance = async () => {
            const userBalance = await getBalance(token);
            setBalance(userBalance);
        }
        fetchBalance();
    }, [token])

    return <div>
        <Appbar user={user.firstName} />
        <div className="m-8">
            <Balance value={balance} />
            <Users />
        </div>
    </div>
}

export default Dashboard;