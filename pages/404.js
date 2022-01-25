// pag para aparecer quando acontecer erro 404

export default function notFoundPage() {
    return (
        <div 
            style={{
                display:"flex", 
                alignItems:"center",
                justifyContent:"center", 
                flexDirection:"column",
            }}
        >
            <>
                <img 
                    src="https://cdn-icons-png.flaticon.com/512/868/868753.png"
                    width={256}
                    height={256}
                />
                <h2 style={{fontSize:32}}>Página não encontrada.</h2>
            </>

            
        </div>
    )
}