'use client'

import { useState, useEffect, useRef } from 'react'

// ─── Dimensions ───────────────────────────────────────────────────────────────
// technical:    quantitative/STEM (1) vs creative/humanistic (0)
// academic:     research/theory (1) vs career/practical (0)
// collaborative: team/people-focused (1) vs solo/independent (0)
// active:       vibrant/social/hands-on (1) vs focused/quiet (0)
// structured:   organized/rigid (1) vs flexible/exploratory (0)
// ambitious:    competitive/intense (1) vs relaxed/balanced (0)

type Dim = 'technical' | 'academic' | 'collaborative' | 'active' | 'structured' | 'ambitious'
type Profile = Record<Dim, number>
const DIMS: Dim[] = ['technical', 'academic', 'collaborative', 'active', 'structured', 'ambitious']
const NEUTRAL: Profile = { technical: 0.5, academic: 0.5, collaborative: 0.5, active: 0.5, structured: 0.5, ambitious: 0.5 }

// ─── College Database ─────────────────────────────────────────────────────────
type DBEntry = { profile: Profile; tags: string[] }

const COLLEGE_DB: Record<string, DBEntry> = {
  'mit': { profile: { technical: 1.0, academic: 0.85, collaborative: 0.5, active: 0.4, structured: 0.7, ambitious: 1.0 }, tags: ['STEM', 'Research', 'Urban', 'Competitive'] },
  'harvard': { profile: { technical: 0.5, academic: 0.95, collaborative: 0.5, active: 0.6, structured: 0.6, ambitious: 1.0 }, tags: ['Ivy League', 'Research', 'Urban', 'Competitive'] },
  'stanford': { profile: { technical: 0.85, academic: 0.85, collaborative: 0.7, active: 0.7, structured: 0.5, ambitious: 0.95 }, tags: ['STEM', 'Research', 'Entrepreneurial', 'Suburban'] },
  'caltech': { profile: { technical: 1.0, academic: 1.0, collaborative: 0.4, active: 0.25, structured: 0.8, ambitious: 0.95 }, tags: ['STEM', 'Research', 'Small', 'Intense'] },
  'yale': { profile: { technical: 0.45, academic: 0.9, collaborative: 0.6, active: 0.65, structured: 0.55, ambitious: 0.95 }, tags: ['Ivy League', 'Liberal Arts', 'Residential', 'Competitive'] },
  'princeton': { profile: { technical: 0.6, academic: 0.95, collaborative: 0.5, active: 0.55, structured: 0.65, ambitious: 0.95 }, tags: ['Ivy League', 'Research', 'Suburban', 'Competitive'] },
  'columbia': { profile: { technical: 0.5, academic: 0.85, collaborative: 0.55, active: 0.7, structured: 0.55, ambitious: 0.9 }, tags: ['Ivy League', 'Urban', 'NYC', 'Competitive'] },
  'university of chicago': { profile: { technical: 0.55, academic: 1.0, collaborative: 0.35, active: 0.3, structured: 0.65, ambitious: 0.9 }, tags: ['Research', 'Intellectual', 'Urban', 'Rigorous'] },
  'uchicago': { profile: { technical: 0.55, academic: 1.0, collaborative: 0.35, active: 0.3, structured: 0.65, ambitious: 0.9 }, tags: ['Research', 'Intellectual', 'Urban', 'Rigorous'] },
  'cornell': { profile: { technical: 0.7, academic: 0.8, collaborative: 0.55, active: 0.55, structured: 0.6, ambitious: 0.85 }, tags: ['Ivy League', 'Research', 'Rural', 'Diverse'] },
  'upenn': { profile: { technical: 0.5, academic: 0.75, collaborative: 0.6, active: 0.65, structured: 0.6, ambitious: 0.85 }, tags: ['Ivy League', 'Business', 'Urban', 'Competitive'] },
  'university of pennsylvania': { profile: { technical: 0.5, academic: 0.75, collaborative: 0.6, active: 0.65, structured: 0.6, ambitious: 0.85 }, tags: ['Ivy League', 'Business', 'Urban', 'Competitive'] },
  'dartmouth': { profile: { technical: 0.45, academic: 0.7, collaborative: 0.65, active: 0.7, structured: 0.5, ambitious: 0.75 }, tags: ['Ivy League', 'Liberal Arts', 'Rural', 'Community'] },
  'brown': { profile: { technical: 0.4, academic: 0.75, collaborative: 0.65, active: 0.75, structured: 0.2, ambitious: 0.75 }, tags: ['Ivy League', 'Open Curriculum', 'Creative', 'Flexible'] },
  'duke': { profile: { technical: 0.55, academic: 0.85, collaborative: 0.6, active: 0.7, structured: 0.55, ambitious: 0.85 }, tags: ['Research', 'Suburban', 'Social', 'Competitive'] },
  'johns hopkins': { profile: { technical: 0.7, academic: 0.95, collaborative: 0.4, active: 0.4, structured: 0.65, ambitious: 0.9 }, tags: ['Research', 'Pre-Med', 'Urban', 'Academic'] },
  'northwestern': { profile: { technical: 0.55, academic: 0.8, collaborative: 0.55, active: 0.6, structured: 0.55, ambitious: 0.85 }, tags: ['Research', 'Suburban', 'Arts', 'Competitive'] },
  'vanderbilt': { profile: { technical: 0.45, academic: 0.75, collaborative: 0.65, active: 0.75, structured: 0.5, ambitious: 0.75 }, tags: ['Research', 'Urban', 'Social', 'Southern'] },
  'rice': { profile: { technical: 0.75, academic: 0.85, collaborative: 0.6, active: 0.55, structured: 0.6, ambitious: 0.8 }, tags: ['Research', 'STEM', 'Small', 'Texas'] },
  'emory': { profile: { technical: 0.45, academic: 0.75, collaborative: 0.6, active: 0.6, structured: 0.5, ambitious: 0.7 }, tags: ['Research', 'Pre-Med', 'Urban', 'Suburban'] },
  'washington university': { profile: { technical: 0.5, academic: 0.8, collaborative: 0.6, active: 0.6, structured: 0.55, ambitious: 0.75 }, tags: ['Research', 'Suburban', 'Pre-Med', 'Competitive'] },
  'washu': { profile: { technical: 0.5, academic: 0.8, collaborative: 0.6, active: 0.6, structured: 0.55, ambitious: 0.75 }, tags: ['Research', 'Suburban', 'Pre-Med', 'Competitive'] },
  'wash u': { profile: { technical: 0.5, academic: 0.8, collaborative: 0.6, active: 0.6, structured: 0.55, ambitious: 0.75 }, tags: ['Research', 'Suburban', 'Pre-Med', 'Competitive'] },
  'carnegie mellon': { profile: { technical: 0.95, academic: 0.8, collaborative: 0.5, active: 0.45, structured: 0.75, ambitious: 0.9 }, tags: ['STEM', 'CS', 'Urban', 'Competitive'] },
  'cmu': { profile: { technical: 0.95, academic: 0.8, collaborative: 0.5, active: 0.45, structured: 0.75, ambitious: 0.9 }, tags: ['STEM', 'CS', 'Urban', 'Competitive'] },
  'georgia tech': { profile: { technical: 0.95, academic: 0.7, collaborative: 0.55, active: 0.6, structured: 0.7, ambitious: 0.8 }, tags: ['STEM', 'Engineering', 'Urban', 'Practical'] },
  'gatech': { profile: { technical: 0.95, academic: 0.7, collaborative: 0.55, active: 0.6, structured: 0.7, ambitious: 0.8 }, tags: ['STEM', 'Engineering', 'Urban', 'Practical'] },
  'uc berkeley': { profile: { technical: 0.75, academic: 0.85, collaborative: 0.55, active: 0.65, structured: 0.5, ambitious: 0.8 }, tags: ['Research', 'STEM', 'Urban', 'Diverse', 'Large'] },
  'berkeley': { profile: { technical: 0.75, academic: 0.85, collaborative: 0.55, active: 0.65, structured: 0.5, ambitious: 0.8 }, tags: ['Research', 'STEM', 'Urban', 'Diverse', 'Large'] },
  'ucla': { profile: { technical: 0.6, academic: 0.75, collaborative: 0.6, active: 0.8, structured: 0.5, ambitious: 0.75 }, tags: ['Research', 'Urban', 'Social', 'Diverse', 'Large'] },
  'usc': { profile: { technical: 0.45, academic: 0.6, collaborative: 0.65, active: 0.85, structured: 0.4, ambitious: 0.65 }, tags: ['Urban', 'Social', 'Film', 'Business', 'LA'] },
  'university of southern california': { profile: { technical: 0.45, academic: 0.6, collaborative: 0.65, active: 0.85, structured: 0.4, ambitious: 0.65 }, tags: ['Urban', 'Social', 'Film', 'Business', 'LA'] },
  'uc san diego': { profile: { technical: 0.75, academic: 0.8, collaborative: 0.5, active: 0.55, structured: 0.55, ambitious: 0.7 }, tags: ['Research', 'STEM', 'Coastal', 'Academic'] },
  'ucsd': { profile: { technical: 0.75, academic: 0.8, collaborative: 0.5, active: 0.55, structured: 0.55, ambitious: 0.7 }, tags: ['Research', 'STEM', 'Coastal', 'Academic'] },
  'michigan': { profile: { technical: 0.65, academic: 0.8, collaborative: 0.6, active: 0.75, structured: 0.55, ambitious: 0.8 }, tags: ['Research', 'Large', 'Social', 'Sports'] },
  'university of michigan': { profile: { technical: 0.65, academic: 0.8, collaborative: 0.6, active: 0.75, structured: 0.55, ambitious: 0.8 }, tags: ['Research', 'Large', 'Social', 'Sports'] },
  'virginia': { profile: { technical: 0.45, academic: 0.75, collaborative: 0.6, active: 0.7, structured: 0.55, ambitious: 0.7 }, tags: ['Public Ivy', 'Tradition', 'Social', 'Suburban'] },
  'uva': { profile: { technical: 0.45, academic: 0.75, collaborative: 0.6, active: 0.7, structured: 0.55, ambitious: 0.7 }, tags: ['Public Ivy', 'Tradition', 'Social', 'Suburban'] },
  'university of virginia': { profile: { technical: 0.45, academic: 0.75, collaborative: 0.6, active: 0.7, structured: 0.55, ambitious: 0.7 }, tags: ['Public Ivy', 'Tradition', 'Social', 'Suburban'] },
  'unc': { profile: { technical: 0.45, academic: 0.7, collaborative: 0.65, active: 0.75, structured: 0.5, ambitious: 0.65 }, tags: ['Public', 'Research', 'Social', 'Sports'] },
  'north carolina': { profile: { technical: 0.45, academic: 0.7, collaborative: 0.65, active: 0.75, structured: 0.5, ambitious: 0.65 }, tags: ['Public', 'Research', 'Social', 'Sports'] },
  'notre dame': { profile: { technical: 0.45, academic: 0.75, collaborative: 0.7, active: 0.75, structured: 0.6, ambitious: 0.75 }, tags: ['Tradition', 'Community', 'Sports', 'Suburban'] },
  'georgetown': { profile: { technical: 0.35, academic: 0.75, collaborative: 0.6, active: 0.7, structured: 0.55, ambitious: 0.8 }, tags: ['Urban', 'Policy', 'International', 'Competitive'] },
  'tufts': { profile: { technical: 0.45, academic: 0.75, collaborative: 0.65, active: 0.65, structured: 0.5, ambitious: 0.7 }, tags: ['Research', 'Suburban', 'International', 'Active'] },
  'boston university': { profile: { technical: 0.5, academic: 0.65, collaborative: 0.6, active: 0.75, structured: 0.5, ambitious: 0.65 }, tags: ['Urban', 'Boston', 'Diverse', 'Large'] },
  'bu': { profile: { technical: 0.5, academic: 0.65, collaborative: 0.6, active: 0.75, structured: 0.5, ambitious: 0.65 }, tags: ['Urban', 'Boston', 'Diverse', 'Large'] },
  'boston college': { profile: { technical: 0.4, academic: 0.65, collaborative: 0.65, active: 0.75, structured: 0.55, ambitious: 0.65 }, tags: ['Suburban', 'Catholic', 'Social', 'Sports'] },
  'bc': { profile: { technical: 0.4, academic: 0.65, collaborative: 0.65, active: 0.75, structured: 0.55, ambitious: 0.65 }, tags: ['Suburban', 'Catholic', 'Social', 'Sports'] },
  'nyu': { profile: { technical: 0.4, academic: 0.65, collaborative: 0.6, active: 0.9, structured: 0.35, ambitious: 0.7 }, tags: ['Urban', 'NYC', 'Arts', 'Large', 'Diverse'] },
  'new york university': { profile: { technical: 0.4, academic: 0.65, collaborative: 0.6, active: 0.9, structured: 0.35, ambitious: 0.7 }, tags: ['Urban', 'NYC', 'Arts', 'Large', 'Diverse'] },
  'ut austin': { profile: { technical: 0.6, academic: 0.65, collaborative: 0.6, active: 0.8, structured: 0.5, ambitious: 0.65 }, tags: ['Large', 'Urban', 'Social', 'Sports', 'Texas'] },
  'texas': { profile: { technical: 0.6, academic: 0.65, collaborative: 0.6, active: 0.8, structured: 0.5, ambitious: 0.65 }, tags: ['Large', 'Urban', 'Social', 'Sports', 'Texas'] },
  'purdue': { profile: { technical: 0.9, academic: 0.65, collaborative: 0.55, active: 0.6, structured: 0.7, ambitious: 0.7 }, tags: ['Engineering', 'STEM', 'Midwestern', 'Practical'] },
  'ohio state': { profile: { technical: 0.55, academic: 0.65, collaborative: 0.6, active: 0.8, structured: 0.5, ambitious: 0.65 }, tags: ['Large', 'Sports', 'Social', 'Midwestern'] },
  'penn state': { profile: { technical: 0.5, academic: 0.6, collaborative: 0.65, active: 0.8, structured: 0.5, ambitious: 0.6 }, tags: ['Large', 'Sports', 'Social', 'Suburban'] },
  'williams': { profile: { technical: 0.4, academic: 0.85, collaborative: 0.6, active: 0.6, structured: 0.5, ambitious: 0.7 }, tags: ['Liberal Arts', 'Small', 'Rural', 'Academic'] },
  'amherst': { profile: { technical: 0.4, academic: 0.85, collaborative: 0.6, active: 0.6, structured: 0.45, ambitious: 0.7 }, tags: ['Liberal Arts', 'Small', 'Rural', 'Academic'] },
  'swarthmore': { profile: { technical: 0.5, academic: 0.9, collaborative: 0.6, active: 0.55, structured: 0.5, ambitious: 0.8 }, tags: ['Liberal Arts', 'Small', 'Suburban', 'Rigorous'] },
  'pomona': { profile: { technical: 0.4, academic: 0.85, collaborative: 0.65, active: 0.7, structured: 0.4, ambitious: 0.7 }, tags: ['Liberal Arts', 'Small', 'California', 'Social'] },
  'wellesley': { profile: { technical: 0.4, academic: 0.85, collaborative: 0.7, active: 0.65, structured: 0.5, ambitious: 0.75 }, tags: ["Women's College", 'Liberal Arts', 'Suburban', 'Academic'] },
  'tulane': { profile: { technical: 0.4, academic: 0.6, collaborative: 0.65, active: 0.9, structured: 0.35, ambitious: 0.6 }, tags: ['Urban', 'Social', 'Culture', 'Southern'] },
  'wake forest': { profile: { technical: 0.45, academic: 0.7, collaborative: 0.65, active: 0.7, structured: 0.55, ambitious: 0.7 }, tags: ['Research', 'Suburban', 'Social', 'Business'] },
  'case western': { profile: { technical: 0.85, academic: 0.8, collaborative: 0.45, active: 0.4, structured: 0.65, ambitious: 0.75 }, tags: ['STEM', 'Research', 'Urban', 'Rigorous'] },
  'rochester': { profile: { technical: 0.65, academic: 0.8, collaborative: 0.5, active: 0.5, structured: 0.6, ambitious: 0.75 }, tags: ['Research', 'STEM', 'Music', 'Urban'] },
}

// ─── Major Database ───────────────────────────────────────────────────────────
const MAJOR_DB: Record<string, DBEntry> = {
  'computer science': { profile: { technical: 1.0, academic: 0.6, collaborative: 0.5, active: 0.4, structured: 0.75, ambitious: 0.85 }, tags: ['STEM', 'Coding', 'High Demand'] },
  'cs': { profile: { technical: 1.0, academic: 0.6, collaborative: 0.5, active: 0.4, structured: 0.75, ambitious: 0.85 }, tags: ['STEM', 'Coding', 'High Demand'] },
  'software engineering': { profile: { technical: 0.95, academic: 0.45, collaborative: 0.6, active: 0.5, structured: 0.8, ambitious: 0.8 }, tags: ['STEM', 'Practical', 'Team-based'] },
  'electrical engineering': { profile: { technical: 0.95, academic: 0.65, collaborative: 0.45, active: 0.55, structured: 0.8, ambitious: 0.8 }, tags: ['Engineering', 'STEM', 'Rigorous'] },
  'mechanical engineering': { profile: { technical: 0.9, academic: 0.55, collaborative: 0.55, active: 0.7, structured: 0.75, ambitious: 0.75 }, tags: ['Engineering', 'Hands-on', 'STEM'] },
  'engineering': { profile: { technical: 0.9, academic: 0.55, collaborative: 0.55, active: 0.65, structured: 0.75, ambitious: 0.75 }, tags: ['STEM', 'Practical', 'Problem-solving'] },
  'biomedical engineering': { profile: { technical: 0.9, academic: 0.75, collaborative: 0.55, active: 0.6, structured: 0.75, ambitious: 0.85 }, tags: ['Engineering', 'Biology', 'Pre-Med'] },
  'data science': { profile: { technical: 0.95, academic: 0.7, collaborative: 0.45, active: 0.35, structured: 0.7, ambitious: 0.8 }, tags: ['STEM', 'Analytics', 'High Demand'] },
  'mathematics': { profile: { technical: 1.0, academic: 0.9, collaborative: 0.3, active: 0.25, structured: 0.65, ambitious: 0.7 }, tags: ['STEM', 'Abstract', 'Analytical'] },
  'math': { profile: { technical: 1.0, academic: 0.9, collaborative: 0.3, active: 0.25, structured: 0.65, ambitious: 0.7 }, tags: ['STEM', 'Abstract', 'Analytical'] },
  'statistics': { profile: { technical: 0.9, academic: 0.75, collaborative: 0.4, active: 0.3, structured: 0.7, ambitious: 0.7 }, tags: ['STEM', 'Analytical', 'Practical'] },
  'physics': { profile: { technical: 1.0, academic: 0.95, collaborative: 0.35, active: 0.45, structured: 0.65, ambitious: 0.75 }, tags: ['STEM', 'Research', 'Abstract'] },
  'chemistry': { profile: { technical: 0.9, academic: 0.85, collaborative: 0.4, active: 0.55, structured: 0.7, ambitious: 0.7 }, tags: ['STEM', 'Lab', 'Research'] },
  'biology': { profile: { technical: 0.75, academic: 0.8, collaborative: 0.45, active: 0.6, structured: 0.65, ambitious: 0.7 }, tags: ['STEM', 'Lab', 'Pre-Med Path'] },
  'biochemistry': { profile: { technical: 0.85, academic: 0.85, collaborative: 0.4, active: 0.6, structured: 0.7, ambitious: 0.75 }, tags: ['STEM', 'Research', 'Pre-Med'] },
  'neuroscience': { profile: { technical: 0.75, academic: 0.9, collaborative: 0.4, active: 0.6, structured: 0.65, ambitious: 0.8 }, tags: ['STEM', 'Research', 'Brain Science'] },
  'pre-med': { profile: { technical: 0.7, academic: 0.75, collaborative: 0.5, active: 0.6, structured: 0.75, ambitious: 0.95 }, tags: ['STEM', 'Rigorous', 'Career-focused'] },
  'pre med': { profile: { technical: 0.7, academic: 0.75, collaborative: 0.5, active: 0.6, structured: 0.75, ambitious: 0.95 }, tags: ['STEM', 'Rigorous', 'Career-focused'] },
  'nursing': { profile: { technical: 0.55, academic: 0.5, collaborative: 0.8, active: 0.85, structured: 0.75, ambitious: 0.65 }, tags: ['Healthcare', 'People-focused', 'Practical'] },
  'public health': { profile: { technical: 0.5, academic: 0.7, collaborative: 0.7, active: 0.65, structured: 0.55, ambitious: 0.65 }, tags: ['Research', 'Social Impact', 'Community'] },
  'environmental science': { profile: { technical: 0.65, academic: 0.75, collaborative: 0.55, active: 0.7, structured: 0.55, ambitious: 0.6 }, tags: ['STEM', 'Sustainability', 'Fieldwork'] },
  'environmental studies': { profile: { technical: 0.45, academic: 0.7, collaborative: 0.65, active: 0.75, structured: 0.45, ambitious: 0.55 }, tags: ['Sustainability', 'Policy', 'Interdisciplinary'] },
  'economics': { profile: { technical: 0.7, academic: 0.75, collaborative: 0.4, active: 0.35, structured: 0.65, ambitious: 0.8 }, tags: ['Analytical', 'Business', 'Research'] },
  'finance': { profile: { technical: 0.65, academic: 0.45, collaborative: 0.5, active: 0.5, structured: 0.7, ambitious: 0.9 }, tags: ['Business', 'Quantitative', 'Career-focused'] },
  'accounting': { profile: { technical: 0.6, academic: 0.35, collaborative: 0.45, active: 0.35, structured: 0.9, ambitious: 0.7 }, tags: ['Business', 'Practical', 'Structured'] },
  'business': { profile: { technical: 0.35, academic: 0.4, collaborative: 0.7, active: 0.65, structured: 0.6, ambitious: 0.85 }, tags: ['Practical', 'Team-based', 'Career-focused'] },
  'business administration': { profile: { technical: 0.35, academic: 0.4, collaborative: 0.7, active: 0.65, structured: 0.6, ambitious: 0.85 }, tags: ['Practical', 'Team-based', 'Career-focused'] },
  'marketing': { profile: { technical: 0.3, academic: 0.35, collaborative: 0.75, active: 0.75, structured: 0.5, ambitious: 0.75 }, tags: ['Creative', 'People-focused', 'Business'] },
  'entrepreneurship': { profile: { technical: 0.4, academic: 0.3, collaborative: 0.7, active: 0.85, structured: 0.35, ambitious: 0.95 }, tags: ['Business', 'Creative', 'Risk-taking'] },
  'political science': { profile: { technical: 0.15, academic: 0.75, collaborative: 0.6, active: 0.55, structured: 0.5, ambitious: 0.7 }, tags: ['Humanities', 'Policy', 'Social'] },
  'poli sci': { profile: { technical: 0.15, academic: 0.75, collaborative: 0.6, active: 0.55, structured: 0.5, ambitious: 0.7 }, tags: ['Humanities', 'Policy', 'Social'] },
  'international relations': { profile: { technical: 0.1, academic: 0.7, collaborative: 0.65, active: 0.65, structured: 0.45, ambitious: 0.7 }, tags: ['Global', 'Policy', 'Social'] },
  'pre-law': { profile: { technical: 0.2, academic: 0.7, collaborative: 0.5, active: 0.6, structured: 0.65, ambitious: 0.9 }, tags: ['Research', 'Argumentation', 'Competitive'] },
  'law': { profile: { technical: 0.2, academic: 0.7, collaborative: 0.5, active: 0.6, structured: 0.65, ambitious: 0.9 }, tags: ['Research', 'Argumentation', 'Competitive'] },
  'psychology': { profile: { technical: 0.4, academic: 0.75, collaborative: 0.65, active: 0.55, structured: 0.55, ambitious: 0.6 }, tags: ['Research', 'People', 'Behavioral Science'] },
  'sociology': { profile: { technical: 0.15, academic: 0.7, collaborative: 0.7, active: 0.6, structured: 0.4, ambitious: 0.5 }, tags: ['Humanities', 'Social', 'Research'] },
  'anthropology': { profile: { technical: 0.15, academic: 0.8, collaborative: 0.6, active: 0.7, structured: 0.35, ambitious: 0.5 }, tags: ['Humanities', 'Fieldwork', 'Research'] },
  'history': { profile: { technical: 0.05, academic: 0.85, collaborative: 0.35, active: 0.3, structured: 0.5, ambitious: 0.5 }, tags: ['Humanities', 'Research', 'Writing'] },
  'philosophy': { profile: { technical: 0.1, academic: 0.95, collaborative: 0.4, active: 0.25, structured: 0.4, ambitious: 0.55 }, tags: ['Abstract', 'Research', 'Critical Thinking'] },
  'english': { profile: { technical: 0.05, academic: 0.8, collaborative: 0.4, active: 0.3, structured: 0.45, ambitious: 0.5 }, tags: ['Humanities', 'Writing', 'Literature'] },
  'literature': { profile: { technical: 0.05, academic: 0.8, collaborative: 0.4, active: 0.3, structured: 0.45, ambitious: 0.5 }, tags: ['Humanities', 'Writing', 'Research'] },
  'linguistics': { profile: { technical: 0.5, academic: 0.85, collaborative: 0.35, active: 0.35, structured: 0.6, ambitious: 0.55 }, tags: ['Research', 'Language', 'Analytical'] },
  'communications': { profile: { technical: 0.2, academic: 0.45, collaborative: 0.75, active: 0.8, structured: 0.4, ambitious: 0.65 }, tags: ['People-focused', 'Media', 'Creative'] },
  'journalism': { profile: { technical: 0.2, academic: 0.55, collaborative: 0.6, active: 0.85, structured: 0.45, ambitious: 0.7 }, tags: ['Writing', 'Media', 'Active'] },
  'film': { profile: { technical: 0.35, academic: 0.5, collaborative: 0.7, active: 0.8, structured: 0.3, ambitious: 0.65 }, tags: ['Creative', 'Arts', 'Collaborative'] },
  'art': { profile: { technical: 0.1, academic: 0.45, collaborative: 0.4, active: 0.75, structured: 0.15, ambitious: 0.55 }, tags: ['Creative', 'Expressive', 'Studio'] },
  'fine arts': { profile: { technical: 0.1, academic: 0.5, collaborative: 0.4, active: 0.75, structured: 0.15, ambitious: 0.55 }, tags: ['Creative', 'Studio', 'Expressive'] },
  'graphic design': { profile: { technical: 0.4, academic: 0.35, collaborative: 0.55, active: 0.7, structured: 0.4, ambitious: 0.65 }, tags: ['Creative', 'Technical', 'Practical'] },
  'design': { profile: { technical: 0.4, academic: 0.4, collaborative: 0.6, active: 0.7, structured: 0.45, ambitious: 0.65 }, tags: ['Creative', 'Problem-solving', 'Practical'] },
  'architecture': { profile: { technical: 0.65, academic: 0.55, collaborative: 0.6, active: 0.75, structured: 0.6, ambitious: 0.8 }, tags: ['Creative', 'Technical', 'Studio'] },
  'music': { profile: { technical: 0.35, academic: 0.55, collaborative: 0.55, active: 0.7, structured: 0.55, ambitious: 0.65 }, tags: ['Arts', 'Performance', 'Creative'] },
  'theater': { profile: { technical: 0.1, academic: 0.45, collaborative: 0.85, active: 0.9, structured: 0.35, ambitious: 0.65 }, tags: ['Performing Arts', 'Collaborative', 'Expressive'] },
  'dance': { profile: { technical: 0.15, academic: 0.4, collaborative: 0.7, active: 1.0, structured: 0.5, ambitious: 0.7 }, tags: ['Performing Arts', 'Physical', 'Expressive'] },
  'education': { profile: { technical: 0.3, academic: 0.6, collaborative: 0.85, active: 0.7, structured: 0.6, ambitious: 0.5 }, tags: ['People-focused', 'Community', 'Practical'] },
  'social work': { profile: { technical: 0.15, academic: 0.55, collaborative: 0.95, active: 0.8, structured: 0.5, ambitious: 0.5 }, tags: ['Community', 'People-focused', 'Social Impact'] },
  'cognitive science': { profile: { technical: 0.6, academic: 0.85, collaborative: 0.4, active: 0.4, structured: 0.6, ambitious: 0.7 }, tags: ['Interdisciplinary', 'Research', 'Mind'] },
  'artificial intelligence': { profile: { technical: 1.0, academic: 0.85, collaborative: 0.45, active: 0.35, structured: 0.7, ambitious: 0.9 }, tags: ['STEM', 'Research', 'High Demand'] },
  'ai': { profile: { technical: 1.0, academic: 0.85, collaborative: 0.45, active: 0.35, structured: 0.7, ambitious: 0.9 }, tags: ['STEM', 'Research', 'High Demand'] },
  'machine learning': { profile: { technical: 0.95, academic: 0.8, collaborative: 0.45, active: 0.35, structured: 0.7, ambitious: 0.85 }, tags: ['STEM', 'Research', 'Data'] },
  'cybersecurity': { profile: { technical: 0.9, academic: 0.6, collaborative: 0.45, active: 0.5, structured: 0.75, ambitious: 0.8 }, tags: ['Tech', 'Security', 'High Demand'] },
  'aerospace engineering': { profile: { technical: 0.95, academic: 0.75, collaborative: 0.55, active: 0.65, structured: 0.8, ambitious: 0.85 }, tags: ['Engineering', 'STEM', 'Rigorous'] },
  'civil engineering': { profile: { technical: 0.8, academic: 0.55, collaborative: 0.6, active: 0.7, structured: 0.75, ambitious: 0.65 }, tags: ['Engineering', 'Practical', 'Infrastructure'] },
  'chemical engineering': { profile: { technical: 0.9, academic: 0.7, collaborative: 0.45, active: 0.6, structured: 0.75, ambitious: 0.8 }, tags: ['Engineering', 'STEM', 'Research'] },
  'information systems': { profile: { technical: 0.7, academic: 0.45, collaborative: 0.6, active: 0.5, structured: 0.65, ambitious: 0.7 }, tags: ['Tech', 'Business', 'Practical'] },
  'supply chain': { profile: { technical: 0.55, academic: 0.4, collaborative: 0.65, active: 0.6, structured: 0.8, ambitious: 0.7 }, tags: ['Business', 'Operations', 'Practical'] },
  'bioinformatics': { profile: { technical: 0.9, academic: 0.85, collaborative: 0.4, active: 0.4, structured: 0.7, ambitious: 0.75 }, tags: ['STEM', 'Research', 'Computational Biology'] },
}

// ─── Quiz Questions ───────────────────────────────────────────────────────────
type QuizAnswer = { emoji: string; text: string; scores: Partial<Profile> }
type QuizQuestion = { id: number; text: string; answers: QuizAnswer[] }

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    text: "What's your ideal way to spend a study session?",
    answers: [
      { emoji: '🖥️', text: 'Coding, equations, or technical problem-solving', scores: { technical: 1.0, academic: 0.5, collaborative: 0.2, active: 0.3, structured: 0.8, ambitious: 0.6 } },
      { emoji: '📚', text: 'Reading deeply and writing thoughtful essays or analyses', scores: { technical: 0.05, academic: 0.9, collaborative: 0.2, active: 0.25, structured: 0.5, ambitious: 0.5 } },
      { emoji: '🤝', text: 'Working through problems with a study group', scores: { technical: 0.5, academic: 0.5, collaborative: 1.0, active: 0.65, structured: 0.4, ambitious: 0.55 } },
      { emoji: '🛠️', text: 'Building something hands-on or running experiments', scores: { technical: 0.75, academic: 0.55, collaborative: 0.45, active: 0.8, structured: 0.5, ambitious: 0.65 } },
      { emoji: '🎨', text: 'Creating — designing, writing fiction, or making art', scores: { technical: 0.1, academic: 0.45, collaborative: 0.4, active: 0.7, structured: 0.2, ambitious: 0.5 } },
    ],
  },
  {
    id: 2,
    text: 'Which future role sounds most like you?',
    answers: [
      { emoji: '💻', text: 'Engineer or data scientist solving complex technical problems', scores: { technical: 1.0, academic: 0.45, collaborative: 0.45, active: 0.35, structured: 0.75, ambitious: 0.85 } },
      { emoji: '🔬', text: 'Researcher or academic pushing the boundaries of knowledge', scores: { technical: 0.55, academic: 1.0, collaborative: 0.3, active: 0.4, structured: 0.65, ambitious: 0.75 } },
      { emoji: '🎯', text: 'Entrepreneur building your own company from scratch', scores: { technical: 0.4, academic: 0.2, collaborative: 0.7, active: 0.85, structured: 0.35, ambitious: 1.0 } },
      { emoji: '🌍', text: 'Advocate or community leader creating social impact', scores: { technical: 0.1, academic: 0.5, collaborative: 0.95, active: 0.8, structured: 0.4, ambitious: 0.7 } },
      { emoji: '🎬', text: 'Creative professional — artist, filmmaker, or designer', scores: { technical: 0.15, academic: 0.4, collaborative: 0.55, active: 0.8, structured: 0.2, ambitious: 0.6 } },
    ],
  },
  {
    id: 3,
    text: 'Pick your ideal campus setting:',
    answers: [
      { emoji: '🌆', text: 'A buzzing city — cafes, internships, and culture everywhere', scores: { technical: 0.5, academic: 0.4, collaborative: 0.6, active: 0.95, structured: 0.35, ambitious: 0.7 } },
      { emoji: '🏛️', text: 'A classic college town — traditions, quads, strong community', scores: { technical: 0.45, academic: 0.55, collaborative: 0.7, active: 0.75, structured: 0.55, ambitious: 0.6 } },
      { emoji: '🌲', text: 'A quiet, wooded retreat — focused and distraction-free', scores: { technical: 0.45, academic: 0.85, collaborative: 0.3, active: 0.2, structured: 0.65, ambitious: 0.55 } },
      { emoji: '🏙️', text: 'A large research university — resources, scale, and diversity', scores: { technical: 0.65, academic: 0.75, collaborative: 0.55, active: 0.65, structured: 0.55, ambitious: 0.75 } },
      { emoji: '🏘️', text: 'A tight-knit college — everyone knows everyone', scores: { technical: 0.2, academic: 0.75, collaborative: 0.75, active: 0.55, structured: 0.5, ambitious: 0.55 } },
    ],
  },
  {
    id: 4,
    text: 'How do you handle pressure and competition?',
    answers: [
      { emoji: '⚡', text: 'I thrive on it — high stakes bring out my best', scores: { technical: 0.55, academic: 0.55, collaborative: 0.3, active: 0.55, structured: 0.6, ambitious: 1.0 } },
      { emoji: '🤝', text: 'I lean on peers — collaboration beats competition any day', scores: { technical: 0.4, academic: 0.4, collaborative: 1.0, active: 0.65, structured: 0.4, ambitious: 0.45 } },
      { emoji: '🔭', text: 'I go deep — mastery over speed, quality over quantity', scores: { technical: 0.5, academic: 0.85, collaborative: 0.2, active: 0.3, structured: 0.65, ambitious: 0.65 } },
      { emoji: '⚖️', text: 'I prefer balance — sustainable progress beats burnout', scores: { technical: 0.4, academic: 0.45, collaborative: 0.5, active: 0.45, structured: 0.55, ambitious: 0.2 } },
      { emoji: '🎯', text: 'I stay practical — clear goals, real outcomes', scores: { technical: 0.5, academic: 0.3, collaborative: 0.5, active: 0.6, structured: 0.75, ambitious: 0.75 } },
    ],
  },
  {
    id: 5,
    text: 'What does your ideal college weekend look like?',
    answers: [
      { emoji: '🏆', text: 'Competing — hackathon, academic bowl, or debate tournament', scores: { technical: 0.65, academic: 0.55, collaborative: 0.55, active: 0.75, structured: 0.55, ambitious: 1.0 } },
      { emoji: '🎉', text: 'Socializing — campus events, clubs, meeting new people', scores: { technical: 0.3, academic: 0.2, collaborative: 0.85, active: 1.0, structured: 0.3, ambitious: 0.5 } },
      { emoji: '📖', text: 'Self-directed study or diving into a personal passion project', scores: { technical: 0.45, academic: 0.95, collaborative: 0.1, active: 0.2, structured: 0.55, ambitious: 0.65 } },
      { emoji: '🌆', text: 'Exploring the city — museums, restaurants, culture', scores: { technical: 0.3, academic: 0.3, collaborative: 0.55, active: 0.9, structured: 0.2, ambitious: 0.45 } },
      { emoji: '🧪', text: 'Working in a lab or contributing to research', scores: { technical: 0.75, academic: 1.0, collaborative: 0.35, active: 0.55, structured: 0.7, ambitious: 0.85 } },
    ],
  },
  {
    id: 6,
    text: "What's your biggest priority when choosing a college?",
    answers: [
      { emoji: '🏅', text: 'Prestige and name recognition', scores: { technical: 0.5, academic: 0.55, collaborative: 0.4, active: 0.45, structured: 0.55, ambitious: 1.0 } },
      { emoji: '🔬', text: 'Research opportunities and world-class faculty', scores: { technical: 0.55, academic: 1.0, collaborative: 0.35, active: 0.35, structured: 0.65, ambitious: 0.75 } },
      { emoji: '💼', text: 'Internship pipeline and career placement', scores: { technical: 0.5, academic: 0.2, collaborative: 0.55, active: 0.65, structured: 0.65, ambitious: 0.85 } },
      { emoji: '🧑‍🤝‍🧑', text: 'Campus community, culture, and sense of belonging', scores: { technical: 0.3, academic: 0.3, collaborative: 0.95, active: 0.85, structured: 0.35, ambitious: 0.4 } },
      { emoji: '🌍', text: 'Diversity, global perspective, and academic freedom', scores: { technical: 0.35, academic: 0.6, collaborative: 0.75, active: 0.75, structured: 0.3, ambitious: 0.55 } },
    ],
  },
  {
    id: 7,
    text: 'Which subject would you take just for the love of it?',
    answers: [
      { emoji: '⚗️', text: 'Advanced math, physics, or computer science', scores: { technical: 1.0, academic: 0.75, collaborative: 0.3, active: 0.3, structured: 0.7, ambitious: 0.75 } },
      { emoji: '📜', text: 'Philosophy, history of civilizations, or political theory', scores: { technical: 0.05, academic: 0.9, collaborative: 0.35, active: 0.3, structured: 0.45, ambitious: 0.55 } },
      { emoji: '💰', text: 'Behavioral economics, entrepreneurship, or strategy', scores: { technical: 0.45, academic: 0.5, collaborative: 0.6, active: 0.65, structured: 0.55, ambitious: 0.85 } },
      { emoji: '🎭', text: 'Creative writing, film theory, or performing arts', scores: { technical: 0.05, academic: 0.45, collaborative: 0.6, active: 0.8, structured: 0.2, ambitious: 0.5 } },
      { emoji: '🧬', text: 'Neuroscience, biology, or environmental science', scores: { technical: 0.75, academic: 0.85, collaborative: 0.35, active: 0.55, structured: 0.65, ambitious: 0.65 } },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function lookupEntry(name: string, db: Record<string, DBEntry>): DBEntry & { found: boolean } {
  const key = name.toLowerCase().trim()
  if (db[key]) return { ...db[key], found: true }
  for (const [dbKey, val] of Object.entries(db)) {
    if (key.includes(dbKey) || dbKey.includes(key)) return { ...val, found: true }
  }
  return { profile: { ...NEUTRAL }, tags: ['Unknown'], found: false }
}

function matchScore(userProfile: Profile, target: Profile): number {
  const diff = DIMS.reduce((sum, d) => sum + Math.abs(userProfile[d] - target[d]), 0)
  return Math.round((1 - diff / DIMS.length) * 100)
}

function buildProfile(answers: Partial<Profile>[]): Profile {
  const sums: Record<Dim, number> = { technical: 0, academic: 0, collaborative: 0, active: 0, structured: 0, ambitious: 0 }
  const counts: Record<Dim, number> = { technical: 0, academic: 0, collaborative: 0, active: 0, structured: 0, ambitious: 0 }
  for (const a of answers) {
    for (const d of DIMS) {
      if (a[d] !== undefined) { sums[d] += a[d]!; counts[d]++ }
    }
  }
  const profile = { ...NEUTRAL }
  for (const d of DIMS) {
    if (counts[d] > 0) profile[d] = sums[d] / counts[d]
  }
  return profile
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const CARD = { background: 'var(--card-bg)', backdropFilter: 'blur(12px)' }
const ACCENT_C = { color: 'var(--accent)' }
const ACCENT_BG = { background: 'var(--accent)' }
const INPUT_S = { borderColor: 'rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.8)' }
const ITEM_S = { background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.06)' }
const TOP_S = { background: 'rgba(200,149,108,0.15)', border: '1px solid rgba(200,149,108,0.3)' }

type Step = 'name' | 'colleges' | 'majors' | 'quiz' | 'results'

// ─── Component ────────────────────────────────────────────────────────────────
export default function Home() {
  const [step, setStep] = useState<Step>('name')
  const [userName, setUserName] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [colleges, setColleges] = useState<string[]>([])
  const [collegeInput, setCollegeInput] = useState('')
  const [majors, setMajors] = useState<string[]>([])
  const [majorInput, setMajorInput] = useState('')
  const [currentQ, setCurrentQ] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [collectedAnswers, setCollectedAnswers] = useState<Partial<Profile>[]>([])

  const firstName = userName.split(' ')[0]

  function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (nameInput.trim()) { setUserName(nameInput.trim()); setStep('colleges') }
  }

  function addToList(value: string, list: string[], setList: (v: string[]) => void, setInput: (v: string) => void) {
    const t = value.trim()
    if (t && list.length < 5 && !list.includes(t)) { setList([...list, t]); setInput('') }
  }

  function handleAnswer(idx: number) {
    if (selectedAnswer !== null) return
    setSelectedAnswer(idx)
    setTimeout(() => {
      setCollectedAnswers(prev => [...prev, QUESTIONS[currentQ].answers[idx].scores])
      if (currentQ + 1 >= QUESTIONS.length) { setStep('results') }
      else { setCurrentQ(currentQ + 1) }
      setSelectedAnswer(null)
    }, 400)
  }

  function handleReset() {
    setStep('name'); setUserName(''); setNameInput('')
    setColleges([]); setCollegeInput(''); setMajors([]); setMajorInput('')
    setCurrentQ(0); setSelectedAnswer(null); setCollectedAnswers([])
    hasSubmitted.current = false
  }

  const hasSubmitted = useRef(false)

  useEffect(() => {
    if (step !== 'results' || hasSubmitted.current) return
    if (!process.env.NEXT_PUBLIC_SHEETS_WEBHOOK_URL) return
    hasSubmitted.current = true

    const userProfile = buildProfile(collectedAnswers)
    const collegeResults = colleges
      .map(name => { const e = lookupEntry(name, COLLEGE_DB); return { name, score: matchScore(userProfile, e.profile) } })
      .sort((a, b) => b.score - a.score)
    const majorResults = majors
      .map(name => { const e = lookupEntry(name, MAJOR_DB); return { name, score: matchScore(userProfile, e.profile) } })
      .sort((a, b) => b.score - a.score)

    fetch(process.env.NEXT_PUBLIC_SHEETS_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        name: userName,
        colleges: collegeResults.map(r => `${r.name} (${r.score}%)`).join(', '),
        majors: majorResults.map(r => `${r.name} (${r.score}%)`).join(', '),
        topCollege: collegeResults[0]?.name ?? '',
        topCollegeScore: collegeResults[0]?.score ?? '',
        topMajor: majorResults[0]?.name ?? '',
        topMajorScore: majorResults[0]?.score ?? '',
      }),
    }).catch(() => {}) // silent fail — never block the user
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Name ──────────────────────────────────────────────────────────────────
  if (step === 'name') return (
    <main className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className="rounded-2xl p-8 shadow-xl max-w-xl w-full" style={CARD}>
        <p className="text-sm font-bold tracking-widest uppercase mb-6" style={ACCENT_C}>🎓 College Fit Finder</p>
        <h1 className="font-serif text-3xl font-bold text-stone-800 mb-2">Find your perfect college fit.</h1>
        <p className="text-stone-500 mb-8">Answer 7 questions and we&apos;ll match you to your colleges and majors.</p>
        <form onSubmit={handleNameSubmit} className="flex flex-col gap-4">
          <input type="text" placeholder="What's your name?" value={nameInput} autoFocus
            onChange={e => setNameInput(e.target.value)}
            className="w-full rounded-xl px-5 py-4 border-2 text-stone-700 font-medium outline-none transition-colors"
            style={INPUT_S}
          />
          <button type="submit" disabled={!nameInput.trim()} style={ACCENT_BG}
            className="w-full rounded-full py-3 font-bold text-white hover:opacity-90 disabled:opacity-40 transition-opacity">
            Get Started →
          </button>
        </form>
      </div>
    </main>
  )

  // ── Colleges ──────────────────────────────────────────────────────────────
  if (step === 'colleges') return (
    <main className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className="rounded-2xl p-8 shadow-xl max-w-xl w-full" style={CARD}>
        <p className="text-sm font-bold tracking-widest uppercase mb-6" style={ACCENT_C}>🎓 College Fit Finder — Step 1 of 2</p>
        <h1 className="font-serif text-2xl font-bold text-stone-800 mb-2">Hey {firstName}! Which colleges are you considering?</h1>
        <p className="text-stone-500 mb-6">Add up to 5. We&apos;ll rank them by how well they match your personality.</p>
        <div className="flex gap-2 mb-4">
          <input type="text" placeholder="e.g. MIT, Stanford, UCLA…" value={collegeInput} disabled={colleges.length >= 5}
            onChange={e => setCollegeInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addToList(collegeInput, colleges, setColleges, setCollegeInput))}
            className="flex-1 rounded-xl px-4 py-3 border-2 text-stone-700 font-medium outline-none transition-colors"
            style={INPUT_S}
          />
          <button onClick={() => addToList(collegeInput, colleges, setColleges, setCollegeInput)}
            disabled={!collegeInput.trim() || colleges.length >= 5} style={ACCENT_BG}
            className="rounded-xl px-4 py-3 font-bold text-white disabled:opacity-40 transition-opacity">Add</button>
        </div>
        {colleges.length > 0 && (
          <div className="flex flex-col gap-2 mb-6">
            {colleges.map((c, i) => {
              const { found } = lookupEntry(c, COLLEGE_DB)
              return (
                <div key={i} className="flex items-center justify-between rounded-xl px-4 py-3" style={ITEM_S}>
                  <span className="text-stone-700 font-medium">
                    {c}{!found && <span className="text-xs text-amber-500 ml-2">⚠ using estimate</span>}
                  </span>
                  <button onClick={() => setColleges(colleges.filter((_, j) => j !== i))} className="text-stone-400 hover:text-red-400 text-xl ml-3">×</button>
                </div>
              )
            })}
          </div>
        )}
        <button onClick={() => setStep('majors')} disabled={colleges.length === 0} style={ACCENT_BG}
          className="w-full rounded-full py-3 font-bold text-white hover:opacity-90 disabled:opacity-40 transition-opacity">
          Continue → Add Majors
        </button>
      </div>
    </main>
  )

  // ── Majors ────────────────────────────────────────────────────────────────
  if (step === 'majors') return (
    <main className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className="rounded-2xl p-8 shadow-xl max-w-xl w-full" style={CARD}>
        <p className="text-sm font-bold tracking-widest uppercase mb-6" style={ACCENT_C}>🎓 College Fit Finder — Step 2 of 2</p>
        <h1 className="font-serif text-2xl font-bold text-stone-800 mb-2">Which majors are you exploring?</h1>
        <p className="text-stone-500 mb-6">Add up to 5. We&apos;ll show how well each one aligns with you.</p>
        <div className="flex gap-2 mb-4">
          <input type="text" placeholder="e.g. Computer Science, Economics…" value={majorInput} disabled={majors.length >= 5}
            onChange={e => setMajorInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addToList(majorInput, majors, setMajors, setMajorInput))}
            className="flex-1 rounded-xl px-4 py-3 border-2 text-stone-700 font-medium outline-none transition-colors"
            style={INPUT_S}
          />
          <button onClick={() => addToList(majorInput, majors, setMajors, setMajorInput)}
            disabled={!majorInput.trim() || majors.length >= 5} style={ACCENT_BG}
            className="rounded-xl px-4 py-3 font-bold text-white disabled:opacity-40 transition-opacity">Add</button>
        </div>
        {majors.length > 0 && (
          <div className="flex flex-col gap-2 mb-6">
            {majors.map((m, i) => {
              const { found } = lookupEntry(m, MAJOR_DB)
              return (
                <div key={i} className="flex items-center justify-between rounded-xl px-4 py-3" style={ITEM_S}>
                  <span className="text-stone-700 font-medium">
                    {m}{!found && <span className="text-xs text-amber-500 ml-2">⚠ using estimate</span>}
                  </span>
                  <button onClick={() => setMajors(majors.filter((_, j) => j !== i))} className="text-stone-400 hover:text-red-400 text-xl ml-3">×</button>
                </div>
              )
            })}
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={() => setStep('colleges')}
            className="flex-1 rounded-full py-3 font-bold text-stone-600 border-2 hover:bg-stone-50 transition-colors"
            style={{ borderColor: 'rgba(0,0,0,0.1)' }}>← Back</button>
          <button onClick={() => setStep('quiz')} disabled={majors.length === 0} style={ACCENT_BG}
            className="flex-1 rounded-full py-3 font-bold text-white hover:opacity-90 disabled:opacity-40 transition-opacity">
            Start Quiz →
          </button>
        </div>
      </div>
    </main>
  )

  // ── Quiz ──────────────────────────────────────────────────────────────────
  if (step === 'quiz') {
    const question = QUESTIONS[currentQ]
    const progress = (currentQ / QUESTIONS.length) * 100
    return (
      <main className="min-h-screen flex items-center justify-center p-4 py-12">
        <div className="rounded-2xl p-8 shadow-xl max-w-xl w-full" style={CARD}>
          <p className="text-sm font-bold tracking-widest uppercase mb-6" style={ACCENT_C}>🎓 College Fit Finder</p>
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold tracking-widest uppercase text-stone-400">
                Question {currentQ + 1} of {QUESTIONS.length}
              </span>
              <span className="text-xs font-bold text-stone-400">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 rounded-full bg-stone-200">
              <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: 'var(--accent)' }} />
            </div>
          </div>
          <h1 className="font-serif text-2xl font-bold text-stone-800 mb-8 leading-snug">{question.text}</h1>
          <div className="flex flex-col gap-3">
            {question.answers.map((answer, idx) => {
              const isSelected = selectedAnswer === idx
              return (
                <button key={idx} onClick={() => handleAnswer(idx)} disabled={selectedAnswer !== null}
                  className="w-full text-left rounded-xl px-5 py-4 border-2 transition-all duration-200 flex items-center gap-4 font-medium text-stone-700"
                  style={isSelected
                    ? { borderColor: 'var(--accent)', background: 'rgba(200,149,108,0.12)' }
                    : { borderColor: 'rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.6)' }}>
                  <span className="text-2xl">{answer.emoji}</span>
                  <span>{answer.text}</span>
                </button>
              )
            })}
          </div>
        </div>
      </main>
    )
  }

  // ── Results ───────────────────────────────────────────────────────────────
  const userProfile = buildProfile(collectedAnswers)

  const collegeResults = colleges
    .map(name => { const e = lookupEntry(name, COLLEGE_DB); return { name, score: matchScore(userProfile, e.profile), tags: e.tags, found: e.found } })
    .sort((a, b) => b.score - a.score)

  const majorResults = majors
    .map(name => { const e = lookupEntry(name, MAJOR_DB); return { name, score: matchScore(userProfile, e.profile), tags: e.tags, found: e.found } })
    .sort((a, b) => b.score - a.score)

  return (
    <main className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className="rounded-2xl p-8 shadow-xl max-w-xl w-full" style={CARD}>
        <p className="text-sm font-bold tracking-widest uppercase mb-4" style={ACCENT_C}>🎓 College Fit Finder</p>
        <h1 className="font-serif text-3xl font-bold text-stone-800 mb-2">Congratulations {firstName}! 🎉</h1>
        <p className="text-stone-500 mb-8">Here&apos;s how your personality matches your colleges and majors.</p>

        <p className="text-sm font-bold tracking-widest uppercase text-stone-400 mb-4">College Match</p>
        <div className="flex flex-col gap-3 mb-8">
          {collegeResults.map((r, i) => (
            <div key={r.name} className="rounded-xl p-4" style={i === 0 ? TOP_S : ITEM_S}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-stone-700 text-sm">{i === 0 ? '👑 ' : ''}{r.name}</span>
                <span className="font-bold text-sm" style={ACCENT_C}>{r.score}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-stone-200 mb-2">
                <div className="h-full rounded-full" style={{ width: `${r.score}%`, background: 'var(--accent)' }} />
              </div>
              <div className="flex flex-wrap gap-1">
                {r.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full text-stone-500" style={{ background: 'rgba(0,0,0,0.05)' }}>{tag}</span>
                ))}
                {!r.found && <span className="text-xs text-amber-500">estimated</span>}
              </div>
            </div>
          ))}
        </div>

        <p className="text-sm font-bold tracking-widest uppercase text-stone-400 mb-4">Major Match</p>
        <div className="flex flex-col gap-3 mb-8">
          {majorResults.map((r, i) => (
            <div key={r.name} className="rounded-xl p-4" style={i === 0 ? TOP_S : ITEM_S}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-stone-700 text-sm">{i === 0 ? '🏆 ' : ''}{r.name}</span>
                <span className="font-bold text-sm" style={ACCENT_C}>{r.score}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-stone-200 mb-2">
                <div className="h-full rounded-full" style={{ width: `${r.score}%`, background: 'var(--accent)' }} />
              </div>
              <div className="flex flex-wrap gap-1">
                {r.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full text-stone-500" style={{ background: 'rgba(0,0,0,0.05)' }}>{tag}</span>
                ))}
                {!r.found && <span className="text-xs text-amber-500">estimated</span>}
              </div>
            </div>
          ))}
        </div>

        <button onClick={handleReset} style={ACCENT_BG}
          className="w-full rounded-full py-3 font-bold text-white hover:opacity-90 transition-opacity">
          Start Over
        </button>
      </div>
    </main>
  )
}
