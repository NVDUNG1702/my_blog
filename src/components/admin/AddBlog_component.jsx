import React, { useState, useRef } from "react";
import { db, storage } from "../../firebase.config";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Editor } from "@tinymce/tinymce-react";
import "../../styles/Admin.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AddBlog_component() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [sections, setSections] = useState([
    { heading: "", content: "", images: [] },
  ]);
  const [progress, setProgress] = useState(0);
  const editorRef = useRef(null);

  const handleUpload = async () => {
    let updatedSections = [...sections];

    // Upload images and update sections with URLs
    await Promise.all(
      sections.map(async (section, index) => {
        const promises = section.images.map((img) => {
          if (img) {
            const storageRef = ref(storage, `images/${img.name}`);
            const uploadTask = uploadBytesResumable(storageRef, img);

            return new Promise((resolve, reject) => {
              uploadTask.on(
                "state_changed",
                (snapshot) => {
                  const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  setProgress(progress);
                },
                (error) => {
                  console.error("Error uploading image:", error);
                  reject(error);
                },
                async () => {
                  try {
                    const downloadURL = await getDownloadURL(
                      uploadTask.snapshot.ref
                    );
                    resolve(downloadURL);
                  } catch (error) {
                    reject(error);
                  }
                }
              );
            });
          }
          return Promise.resolve("");
        });

        const imageUrls = await Promise.all(promises);
        updatedSections[index] = { ...section, images: imageUrls };
      })
    );

    try {
      await addDoc(collection(db, "posts"), {
        title,
        author,
        sections: updatedSections,
        createdAt: new Date(),
      });
      alert("Post added successfully!");
      setTitle("");
      setSections([{ content: "", images: [] }]);
      setProgress(0);
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  const handleSectionChange = (index, e) => {
    const { name, value } = e.target;
    console.log(name, value);
    console.log(sections);

    const updatedSections = [...sections];
    updatedSections[index] = { ...updatedSections[index], [name]: value };
    setSections(updatedSections);
  };

  const addSection = () => {
    setSections([...sections, { heading: "", content: "", images: [] }]);
  };

  const handleFileChange = (index, e) => {
    const files = Array.from(e.target.files);
    const updatedSections = [...sections];
    updatedSections[index].images = files;
    setSections(updatedSections);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpload();
  };

  const logEditorContent = () => {
    if (editorRef.current) {
      console.log("Editor content:", editorRef.current.getContent());
    }
  };

  const deleteSection = (index) => {
    const updatedSections = sections.filter((_, i) => i !== index);
    setSections(updatedSections);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Tiêu đề"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="form-control input w-50 m-auto"
      />
      <input
        type="text"
        placeholder="Tác giả"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="form-control input w-50 m-auto mt-3"
      />
      {sections.map((section, index) => (
        <div key={index} className="form_content">
          <Editor
            apiKey="gg8ll8lsa9ijslpi4sg1i1u4ixnqttv1hcpak8gxp9dbjl8x"
            onInit={(_, editor) => (editorRef.current = editor)}
            initialValue={section.content}
            init={{
              width: 800,
              height: 200,
              menubar: false,
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | blocks | " +
                "bold italic forecolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | " +
                "removeformat | help",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
            onChange={(e) =>
              handleSectionChange(index, {
                target: { name: "content", value: e.target.getContent() },
              })
            }
          />
          <input
            type="file"
            multiple
            onChange={(e) => handleFileChange(index, e)}
            className="input"
          />
          {section.images.length > 0 && (
            <div>
              {section.images.map((file, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${i}`}
                  width="100"
                />
              ))}
            </div>
          )}
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={() => deleteSection(index)}
          >
            Delete
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-outline-primary m-5"
        onClick={addSection}
      >
        Thêm phần
      </button>
      <button type="submit" className="btn btn-outline-info m-5">
        Đăng bài
      </button>
    </form>
  );
}
