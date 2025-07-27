import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";

const divisionSchema = new Schema<IDivision>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    thumbnail: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

divisionSchema.pre("save", async function (next) {
  const baseSlug = this.name
    ?.split(" ")
    .join("-")
    .concat("-division")
    .toLowerCase();
  this.slug = baseSlug;

  next();
});

divisionSchema.pre("findOneAndUpdate", async function (next) {
  const division = this.getUpdate() as IDivision;
  const baseSlug = division.name
    ?.split(" ")
    .join("-")
    .concat("-division")
    .toLowerCase();

  division.slug = baseSlug;

  this.setUpdate(division);
  next();
});
export const Division = model<IDivision>("Division", divisionSchema);
