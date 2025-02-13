type PaginationParams = {
  total: number
  perPage: number
  currentPage: number
  callBack: (page:number) => void
}

const Pagination = ({ total, perPage, currentPage, callBack } : PaginationParams) => {
    const totalPages = Math.ceil(total / perPage)
  
    return (
        <div className="mt-5 flex flex-1 items-center justify-between">
          <div className="mr-10">
            <p className="text-sm text-gray-700">
              Showing page {' '}
              <span className="font-medium">
                {currentPage}
              </span>{' '}
              of <span className="font-medium">{totalPages}</span>
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              {[...Array(totalPages)].map((x, i) => (
                <div
                  key={i}
                  onClick={() => callBack(i + 1)}
                  className={
                    currentPage === i + 1
                      ? 'relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-gray-900 text-white ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer'
                      : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 cursor-pointer'
                  }
                >
                  {i + 1}
                </div>
              ))}
            </nav>
          </div>
        </div>
    )
  }
  
  export default Pagination