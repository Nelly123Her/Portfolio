import React from "react";
import kaliMoto from '../assets/kali-moto.webp';  // Import images
import terraformImg from '../assets/Terraform.jpg'; 
import metasploit from '../assets/metasploit.avif'

const BlogSection = () => {
  const blogs = [
    {
      id: 1,
      title: "How to Build a Full-Stack Application",
      description:
        "Learn the steps to create a full-stack web application from scratch using modern technologies.",
      image: kaliMoto,
      link: "#",
    },
    {
      id: 2,
      title: "Designing with Tailwind CSS",
      description:
        "Explore tips and tricks for designing beautiful websites using Tailwind CSS.",
      image: terraformImg,
      link: "#",
    },
    {
      id: 3,
      title: "Understanding React Hooks",
      description:
        "An in-depth guide to React hooks and how to effectively use them in your projects.",
      image: metasploit,
      link: "#",
    },
  ];

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">Latest Blog Posts</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
                <p className="text-gray-700 mb-4">{blog.description}</p>
                <a
                  href={blog.link}
                  className="text-indigo-500 hover:text-indigo-700 font-semibold"
                >
                  Read More →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;