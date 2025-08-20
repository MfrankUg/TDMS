export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('https://i.ibb.co/0ySs51QD/tdms-in-warehouse.png')" }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        </div>
        <div className="relative z-10 w-full">
         {children}
        </div>
      </div>
  )
}
