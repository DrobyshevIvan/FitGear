import iconSearch from '../assets/search.svg';


export default function SearchBar({ search, onSearchChange }) {
    return (
        <>
            <form className="w-[700px]">
                <div className="relative">
                    <div className="inset-y-0 left-0 flex items-center pl-5 pointer-events-none absolute">
                        <img src={iconSearch} alt="icon" />
                    </div>
                    <input type="search" id="default-search"
                        value={search}
                        onChange={e => onSearchChange( e.target.value )}
                        className="block w-full p-4 pl-13 h-13 text-lg text-gray-900 border rounded-full bg-gray-50 focus:border-gray-400"
                        placeholder="Search"
                        required
                    />
                </div>
            </form>
        </>
    )
}