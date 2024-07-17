import { useState } from "react";

export default function SearchBar(props : {
    handleSubmit: any
}) {

    const [title, setTitle] = useState('');

    const handleSubmit = (event: any) => {
        event.preventDefault();
        props.handleSubmit(title);
    }


    return (
    <form onSubmit={handleSubmit} className="mt-5 sm:flex sm:items-center">
        <div className="w-full sm:max-w-xs">
          <label htmlFor="title" className="sr-only">
            Enter film title
          </label>
          <input
            id="title"
            name="title"
            type="title"
            placeholder="enter film title"
            value={title} onChange={(event) => setTitle(event.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset pl-2 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        <button
          type="submit"
          className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto"
        >
          Search
        </button>
      </form>
    )
  }