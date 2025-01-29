const Appbar=({user})=>{
    return <div className="w-full relative item-center px-4 sm:px-14 shadow h-14 flex justify-between">
        <div className="flex flex-col justify-center h-full ml-4">
            PayTM Lite
        </div>
        <div className="flex">
            <div className="flex flex-col justify-center h-full mr-4">
                Hello,{user}
            </div>
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    U
                </div>
            </div>
        </div>
    </div>
}
export default Appbar;