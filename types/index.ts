import type { Id } from '../convex/_generated/dataModel';

export type UserRole = 'admin' | 'editor' | 'user';

export interface User {
  _id: Id<'users'>;
  clerkId: string;
  email: string;
  name: string;
  imageUrl?: string;
  role: UserRole;
}

export interface Blog {
  _id: Id<'blogs'>;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImageUrl?: string;
  coverImageId?: Id<'_storage'>;
  tags: string[];
  authorId: string;
  authorName: string;
  published: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Event {
  _id: Id<'events'>;
  title: string;
  description: string;
  eventDate: number;
  location: string;
  bannerImageUrl?: string;
  published: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Contact {
  _id: Id<'contacts'>;
  name: string;
  email: string;
  phone?: string;
  message: string;
  resolved: boolean;
  createdAt: number;
}

export interface PistonSpecs {
  TL: number;
  KH: number;
  PIN: string;
  bowlDia?: number;
  bowlDepth?: number;
}

export interface RingSizes {
  ring1: number;
  ring2?: number;
  ring3?: number;
  ring4?: number;
  ring5?: number;
  note?: string;
  ring1Specification?: string;
  ring2Specification?: string;
  ring3Specification?: string;
  ring4Specification?: string;
  ring5Specification?: string;
}

export interface CatalogEntry {
  _id: Id<'catalog'>;
  brand: string;
  model: string;
  boreDiameter: number;
  pistonSpecs: PistonSpecs;
  ringSizes: RingSizes;
  pistonType?: string;
  imageId?: Id<'_storage'>;
  imageUrl?: string;
  createdAt: number;
  updatedAt: number;
}
