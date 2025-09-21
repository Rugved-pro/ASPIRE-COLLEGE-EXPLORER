"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"

interface CareerSearchProps {
  onSearch: (query: string) => void
  onFilterChange: (filters: string[]) => void
}

export function CareerSearch({ onSearch, onFilterChange }: CareerSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const filterCategories = [
    { id: "science", name: "Science & Technology", color: "bg-blue-500" },
    { id: "healthcare", name: "Healthcare", color: "bg-green-500" },
    { id: "business", name: "Business & Finance", color: "bg-purple-500" },
    { id: "arts", name: "Creative Arts", color: "bg-orange-500" },
    { id: "education", name: "Education", color: "bg-teal-500" },
    { id: "engineering", name: "Engineering", color: "bg-indigo-500" },
  ]

  const personalityTraits = [
    { id: "analytical", name: "Analytical" },
    { id: "creative", name: "Creative" },
    { id: "leadership", name: "Leadership" },
    { id: "social", name: "People-oriented" },
    { id: "detail", name: "Detail-oriented" },
    { id: "innovative", name: "Innovative" },
  ]

  const educationLevels = [
    { id: "diploma", name: "Diploma" },
    { id: "bachelor", name: "Bachelor's" },
    { id: "master", name: "Master's" },
    { id: "phd", name: "PhD" },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  const toggleFilter = (filterId: string) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter((id) => id !== filterId)
      : [...activeFilters, filterId]

    setActiveFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    setActiveFilters([])
    onFilterChange([])
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search for a career (e.g., Doctor, Software Engineer)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 pr-4 h-12 text-lg bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary"
        />
      </form>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex items-center space-x-2 flex-wrap">
          <span className="text-sm font-medium text-foreground">Active filters:</span>
          {activeFilters.map((filterId) => {
            const filter = [...filterCategories, ...personalityTraits, ...educationLevels].find(
              (f) => f.id === filterId,
            )
            return (
              <Badge key={filterId} variant="secondary" className="flex items-center space-x-1">
                <span>{filter?.name}</span>
                <button onClick={() => toggleFilter(filterId)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )
          })}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-primary">
            Clear all
          </Button>
        </div>
      )}

      {/* Filter Categories */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Interest Areas</h3>
          <div className="flex flex-wrap gap-2">
            {filterCategories.map((category) => (
              <Button
                key={category.id}
                variant={activeFilters.includes(category.id) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFilter(category.id)}
                className={`${activeFilters.includes(category.id) ? category.color : ""} transition-all duration-200`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Personality Traits</h3>
          <div className="flex flex-wrap gap-2">
            {personalityTraits.map((trait) => (
              <Button
                key={trait.id}
                variant={activeFilters.includes(trait.id) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFilter(trait.id)}
                className="transition-all duration-200"
              >
                {trait.name}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Education Level</h3>
          <div className="flex flex-wrap gap-2">
            {educationLevels.map((level) => (
              <Button
                key={level.id}
                variant={activeFilters.includes(level.id) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFilter(level.id)}
                className="transition-all duration-200"
              >
                {level.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
