"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "@/components/NavBar";
import { useRouter } from "next/navigation";
import User from "@/models/userModel";

export default function ResourcesPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [course, setCourse] = useState("");
  const [file, setFile] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
        try {
            const response = await axios.get("/api/users/userinfo");
            if (response.data.user) {
                setUser (response.data.user);
            } else {
                setError("User  information not found");
            }
        } catch (error) {
            setError("Failed to fetch user information");
        } finally {
            setLoading(false);
        }
    };

    const fetchResources = async () => {
      try {
        const response = await axios.get("/api/resources");
        setResources(response.data.resources);
        setFilteredResources(response.data.resources);
      } catch (error) {
        console.error("Error fetching resources:", error);
        setError("Failed to fetch resources");
      }
    };
    fetchUserInfo();
    fetchResources();
  }, []);

  const handleFilter = (course) => {
    setCourse(course);
    const filtered = resources.filter((resource) => resource.course === course);
    setFilteredResources(filtered);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("course", course);
      const response = await axios.post("/api/resources/upload", formData);
      setResources([...resources, response.data.resource]);
      setFilteredResources([...filteredResources, response.data.resource]);
      setFile(null);
    } catch (error) {
      console.error("Error uploading resource:", error);
      setError("Failed to upload resource");
    }
  };

  const handleDelete = async (resourceId) => {
    try {
      await axios.delete(`/api/resources/${resourceId}`);
      setResources(resources.filter((resource) => resource.resourceId !== resourceId));
      setFilteredResources(filteredResources.filter((resource) => resource.resourceId !== resourceId));
    } catch (error) {
      console.error("Error deleting resource:", error);
      setError("Failed to delete resource");
    }
  };

  const handleApprove = async (resourceId, isApproved) => {
    try {
      await axios.put(`/api/resources/${resourceId}`, { isApproved });
      setResources(
        resources.map((resource) =>
          resource.resourceId === resourceId ? { ...resource, isApproved } : resource
        )
      );
      setFilteredResources(
        filteredResources.map((resource) =>
          resource.resourceId === resourceId ? { ...resource, isApproved } : resource
        )
      );
    } catch (error) {
      console.error("Error approving resource:", error);
      setError("Failed to approve resource");
    }
  };

  return (
    <div>
      <NavBar />
      {user && user.role === "faculty" ? (
        <div>
          <h1>Resources</h1>
          <button onClick={() => handleFilter("CSE370")}>CSE370</button>
          <button onClick={() => handleFilter("CSE470")}>CSE470</button>
          <button onClick={() => handleFilter("CSE471")}>CSE471</button>
          <ul>
            {filteredResources.map((resource) => (
              <li key={resource.resourceId}>
                {resource.resources.join(", ")}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h1>Resources</h1>
          <div>
            <h2>CSE370</h2>
            <form onSubmit={handleUpload}>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
              <button type="submit">Upload</button>
            </form>
            <ul>
              {resources
                .filter((resource) => resource.course === "CSE370")
                .map((resource) => (
                  <li key={resource.resourceId}>
                    {resource.resources.join(", ")}
                    <button onClick={() => handleDelete(resource.resourceId)}>Delete</button>
                    <select
                      value={resource.isApproved}
                      onChange={(e) => handleApprove(resource.resourceId, e.target.value === "true")}
                    >
                      <option value="true ">Approved</option>
                      <option value="false">Not Approved</option>
                    </select>
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <h2>CSE470</h2>
            <form onSubmit={handleUpload}>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
              <button type="submit">Upload</button>
            </form>
            <ul>
              {resources
                .filter((resource) => resource.course === "CSE470")
                .map((resource) => (
                  <li key={resource.resourceId}>
                    {resource.resources.join(", ")}
                    <button onClick={() => handleDelete(resource.resourceId)}>Delete</button>
                    <select
                      value={resource.isApproved}
                      onChange={(e) => handleApprove(resource.resourceId, e.target.value === "true")}
                    >
                      <option value="true">Approved</option>
                      <option value="false">Not Approved</option>
                    </select>
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <h2>CSE471</h2>
            <form onSubmit={handleUpload}>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
              <button type="submit">Upload</button>
            </form>
            <ul>
              {resources
                .filter((resource) => resource.course === "CSE471")
                .map((resource) => (
                  <li key={resource.resourceId}>
                    {resource.resources.join(", ")}
                    <button onClick={() => handleDelete(resource.resourceId)}>Delete</button>
                    <select
                      value={resource.isApproved}
                      onChange={(e) => handleApprove(resource.resourceId, e.target.value === "true")}
                    >
                      <option value="true">Approved</option>
                      <option value="false">Not Approved</option>
                    </select>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
      {error && <p>{error}</p>}
    </div>
  );
}