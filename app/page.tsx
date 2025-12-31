import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">威士忌評論網站</h1>
        <div className="space-y-4">
          <Link 
            href="/whiskey/1" 
            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold">範例酒款詳情頁面</h2>
            <p className="text-gray-600">點擊查看酒款詳情與評論</p>
          </Link>
          <Link 
            href="/whiskey/new" 
            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold">新增酒款</h2>
            <p className="text-gray-600">新增新的威士忌酒款</p>
          </Link>
        </div>
      </div>
    </main>
  )
}

