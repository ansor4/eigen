import { differenceWith, filter, some, union } from "lodash"
import React, { createContext, Dispatch, Reducer, useReducer } from "react"

const filterState: ArtworkFilterContextState = {
  appliedFilters: [],
  selectedFilters: [],
  selectedSortOption: "Default",
  applyFilters: false,
}

export const reducer = (
  artworkFilterState: ArtworkFilterContextState,
  action: FilterActions
): ArtworkFilterContextState => {
  let sanitizeFilters = []

  switch (action.type) {
    case "applyFilters":
      const previouslyAppliedFilters = artworkFilterState.appliedFilters

      // if a filter is applied for the first time update state with the newly applied filter
      if (previouslyAppliedFilters.length < 1) {
        return {
          applyFilters: true,
          appliedFilters: action.payload,
          selectedFilters: [],
          selectedSortOption: artworkFilterState.selectedSortOption,
        }
      }

      // otherwise remove filters that can only be selected once, e.g. "sort" and merge those with newly applied filters
      const payloadFilters = action.payload
      sanitizeFilters = filter(previouslyAppliedFilters, prop => prop.filter === "sort")
      const appliedFilters = union(differenceWith(previouslyAppliedFilters, sanitizeFilters), payloadFilters)

      return {
        applyFilters: true,
        appliedFilters,
        selectedFilters: [],
        selectedSortOption: artworkFilterState.selectedSortOption,
      }

    case "selectFilters":
      const previouslySelectedFilters = artworkFilterState.selectedFilters
      const currentlySelectedFilter = action.payload
      const isFilterAlreadySelected = some(previouslySelectedFilters, currentlySelectedFilter)
      const selectedFilter: Array<{ type: SortOption; filter: FilterOption }> = []
      const filtersApplied = artworkFilterState.appliedFilters

      if (isFilterAlreadySelected) {
        const mergedFilters = [...previouslySelectedFilters, currentlySelectedFilter]

        return {
          applyFilters: false,
          selectedFilters: mergedFilters,
          appliedFilters: filtersApplied,
          selectedSortOption: currentlySelectedFilter.type,
        }
      } else {
        selectedFilter.push(currentlySelectedFilter)

        return {
          applyFilters: false,
          selectedFilters: selectedFilter,
          appliedFilters: filtersApplied,
          selectedSortOption: currentlySelectedFilter.type,
        }
      }
    case "resetFilters":
      return { applyFilters: false, appliedFilters: [], selectedFilters: [], selectedSortOption: "Default" }
  }
}

export const ArtworkFilterContext = createContext<ArtworkFilterContext>(null)

export const ArtworkFilterGlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer<Reducer<ArtworkFilterContextState, FilterActions>>(reducer, filterState)

  return <ArtworkFilterContext.Provider value={{ state, dispatch }}>{children}</ArtworkFilterContext.Provider>
}

export interface ArtworkFilterContextState {
  readonly appliedFilters: ReadonlyArray<{ readonly type: SortOption; readonly filter: FilterOption }>
  readonly selectedFilters: ReadonlyArray<{ readonly type: SortOption; readonly filter: FilterOption }>
  readonly selectedSortOption: SortOption
  readonly applyFilters: boolean
}

interface ResetFilters {
  type: "resetFilters"
}

interface ApplyFilters {
  type: "applyFilters"
  payload: Array<{ type: SortOption; filter: FilterOption }>
}

interface SelectFilters {
  type: "selectFilters"
  payload: { type: SortOption; filter: FilterOption }
}

export type FilterActions = ResetFilters | ApplyFilters | SelectFilters

interface ArtworkFilterContext {
  state: ArtworkFilterContextState
  dispatch: Dispatch<FilterActions>
}

export type SortOption =
  | "Default"
  | "Price (low to high)"
  | "Price (high to low)"
  | "Recently updated"
  | "Recently added"
  | "Artwork year (descending)"
  | "Artwork year (ascending)"

export type FilterOption = "sort" | "medium" | "waysToBuy" | "priceRange" | "size" | "color" | "timePeriod"

export enum ArtworkSorts {
  "Default" = "-decayed_merch",
  "Price (high to low)" = "sold,-has_price,-prices",
  "Price (low to high)" = "sold,-has_price,prices",
  "Recently updated" = "-partner_updated_at",
  "Recently added" = "-published_at",
  "Artwork year (descending)" = "-year",
  "Artwork year (ascending)" = "year",
}
