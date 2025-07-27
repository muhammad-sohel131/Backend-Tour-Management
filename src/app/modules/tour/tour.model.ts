import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";

const tourTypeSchema = new Schema<ITourType>(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const TourType = model<ITourType>("TourType", tourTypeSchema);

const tourSchema = new Schema<ITour>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
    },
    images: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
    },
    costFrom: {
      type: Number,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    arrivalLocation: {
      type: String,
    },
    departureLocation: {
      type: String,
    },
    included: {
      type: [String],
      default: [],
    },
    excluded: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String],
      default: [],
    },
    tourPlane: {
      type: [String],
      default: [],
    },
    maxGuest: {
      type: Number,
    },
    minAge: {
      type: Number,
    },
    division: {
      type: Schema.Types.ObjectId,
      ref: "Division",
      required: true,
    },
    tourType: {
      type: Schema.Types.ObjectId,
      ref: "TourType",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

tourSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    const baseSlug = this.title?.split(" ").join("-").toLowerCase();
    this.slug = baseSlug;
  }
  next();
});
tourSchema.pre("findOneAndUpdate", async function (next) {
  const tour = this.getUpdate() as Partial<ITour>;

  if (tour.title) {
    const baseSlug = tour.title?.split(" ").join("-").toLowerCase();
    tour.slug = baseSlug;
  }
  this.setUpdate(tour);
  next();
});
export const Tour = model<ITour>("Tour", tourSchema);
