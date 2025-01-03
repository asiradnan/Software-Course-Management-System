import { connectDB } from "@/db/db";
import Resource from "@/models/resourceModel";
import { NextResponse } from "next/server";

connectDB();

export async function GET(request) {
  try {
    const resources = await Resource.find({});
    return NextResponse.json({ resources }, { status: 200 });
  } catch (error) {
    console.error("Error fetching resources:", error);
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { course, resources } = body;
    const newResource = new Resource({ course, resources });
    await newResource.save();
    return NextResponse.json({ resource: newResource }, { status: 201 });
  } catch (error) {
    console.error("Error uploading resource:", error);
    return NextResponse.json({ error: "Failed to upload resource" }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const { resourceId } = context.params;
    await Resource.findOneAndDelete({ resourceId });
    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    console.error("Error deleting resource:", error);
    return NextResponse.json({ error: "Failed to delete resource" }, { status: 500 });
  }
}

export async function PUT(request, context) {
  try {
    const { resourceId } = context.params;
    const body = await request.json();
    const { isApproved } = body;
    const updatedResource = await Resource.findOneAndUpdate(
      { resourceId },
      { isApproved },
      { new: true }
    );
    return NextResponse.json({ resource: updatedResource }, { status: 200 });
  } catch (error) {
    console.error("Error approving resource:", error);
    return NextResponse.json({ error: "Failed to approve resource" }, { status: 500 });
  }
}