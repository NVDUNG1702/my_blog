import { Editor } from "@tinymce/tinymce-react";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import styles from "./AddPostStyle.module.scss";
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  useTheme,
} from "@mui/material";
import { categoryAPI } from "../../service/categoryAPI";
import { postAPI } from "../../service/postAPI";
import Swal from "sweetalert2";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const AddPost_component = () => {
  const theme = useTheme();
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [author, setAuth] = useState("");
  const [source, setSource] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState([]);
  const [topicFocused, setTopicFocused] = useState([]);
  // use
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setTopicFocused(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  useEffect(() => {
    const getTopic = async () => {
      const data = await categoryAPI.getAllTopic();
      if (data.status == 200) {
        setTopic(data.data);
      }
    };
    try {
      setLoading(true);
      getTopic();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log(topicFocused);
  }, [topicFocused]);

  const addPost = async () => {
    const data = await postAPI.addPost({
      author,
      title,
      source,
      content,
      topics: topicFocused,
    });
    if (data.status === 201) {
      Swal.fire({
        // position: "top-end",
        icon: "success",
        title: data.message,
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      Swal.fire({
        // position: "top-end",
        icon: "error",
        title: data.error,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div className={clsx("j_center flex_column", styles.container)}>
      <p className="pt-3 fs-2 fw-medium">NEW POST</p>
      <div>
        {!loading && (
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="lable_type">Select Categories</InputLabel>
            <Select
              labelId="lable_type"
              id="lable_tip"
              multiple
              value={topicFocused}
              onChange={handleChange}
              input={
                <OutlinedInput id="lable_type" label="Select Categories" />
              }
              MenuProps={MenuProps}
            >
              {topic.map((item) => (
                <MenuItem
                  key={item.id}
                  value={item}
                  style={getStyles(item.name, topicFocused, theme)}
                >
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <div>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {topicFocused.map((value, i) => (
              <Chip
                key={value.id}
                label={value.name}
                onDelete={() => {
                  const newList = topicFocused.filter(
                    (_, index) => index !== i
                  );
                  setTopicFocused(newList);
                }}
              />
            ))}
          </Box>
        </div>
      </div>
      <input
        className={clsx(styles.inputTitle)}
        type="text"
        placeholder="Tiêu đề bài viết"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <input
        className={clsx(styles.inputContent)}
        type="text"
        placeholder="Tác giả"
        value={author}
        onChange={(e) => {
          setAuth(e.target.value);
        }}
      />
      <input
        className={clsx(styles.inputContent)}
        type="text"
        placeholder="Source"
        value={source}
        onChange={(e) => {
          setSource(e.target.value);
        }}
      />

      <Editor
        apiKey="gg8ll8lsa9ijslpi4sg1i1u4ixnqttv1hcpak8gxp9dbjl8x"
        onInit={(_, editor) => (editorRef.current = editor)}
        initialValue={content}
        init={{
          width: `90%`,
          height: `300px`,
          menubar: false,
          min_height: "50vh",
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
            "image",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic underline strikethrough forecolor backcolor | " +
            "fontselect fontsizeselect | alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | " +
            "link image media | emoticons | fullscreen | removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
        onChange={(e) => setContent(e.target.getContent())}
      />

      <Button
        variant="contained"
        className={clsx("mt-3 mb-3 w-75")}
        onClick={addPost}
      >
        Done
      </Button>
    </div>
  );
};

export default AddPost_component;
