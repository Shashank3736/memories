import GridPostList from "@/components/shared/GridPostList"
import Loader from "@/components/shared/Loader"
import SearchResults from "@/components/shared/SearchResults"
import { Input } from "@/components/ui/input"
import useDebounce from "@/hooks/useDebounce"
import { useGetPosts, useSearchPosts } from "@/lib/react-query/queriesAndMutations"
import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"

const Explore = () => {
  const [searchValue, setSearchValue] = useState('')
  const debouncedSearchValue = useDebounce(searchValue, 500)
  const { ref, inView } = useInView()

  // console.log(debouncedSearchValue)
  const { data: searchedPosts, isFetching: isSearchFetching} = useSearchPosts(debouncedSearchValue)
  const { data:posts, fetchNextPage, hasNextPage } = useGetPosts()

  useEffect(() => {
    if(inView && !debouncedSearchValue) {
      fetchNextPage();
    }
  }, [inView, debouncedSearchValue])

  if(!posts) {
    return (<div className="flex-center h-full w-full">
      <Loader />
    </div>)
  }

  // console.log(searchedPosts)

  const shouldShowSearchResults = debouncedSearchValue.length > 0
  const shouldShowPosts = !shouldShowSearchResults && posts.pages.every(item => item?.documents?.keys.length > 0)

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img src="/assets/icons/search.svg" width={24} height={24} alt="search" />
          <Input 
          type="text" 
          className="explore-search" 
          placeholder="Search for posts" 
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)} />
        </div>

        <div className="flex-between w-full max-w-5xl mt-16 mb-7">
          <h3 className="body-bold md:h3-bold">
            Popular Today
          </h3>

          <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
            <p className="small-medium md:base-medium text-light-2">All</p>
            <img src="/assets/icons/filter.svg" alt="filter" width={20} height={20} />
          </div>
        </div>
        <div className="flex flex-wrap gap-9 w-full max-w-5xl">
          {shouldShowSearchResults && searchedPosts ? (
            <SearchResults 
            isSearchFetching={isSearchFetching}
            searchedPosts={searchedPosts}
            />
          ): shouldShowPosts ? (
            <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
          ): posts.pages.map((item, index) => (
            <GridPostList key={`page-${index}`} posts = {item.documents} />
          ))}
        </div>
      </div>
      
      {hasNextPage && !searchValue && (
        <div ref={ref} className="flex-center mt-10">
          <Loader />
        </div>
      )}

    </div>
  )
}

export default Explore