export default function submitReview({commentValue, commentOnCh,submitComment}){
    return(
        <div className="mx-auto overflow-hidden mb-[25px]">
            <div className="mx-[10px] flex items-center gap-1.5">
                <input value={commentValue} onChange={commentOnCh} className="w-full border-1 border-gray-400 rounded-xl p-2" type="text" placeholder="Write Your Review"/>
                <button onClick={submitComment} className="cursor-pointer"><img className="h-[40px] w-[40px]" src="./sent.png"/></button>

            </div>

        </div>
    )
}