import React, { memo, useState } from "react";
import { format } from "date-fns";

export default memo(function ItemBlog_component({ item }) {
  const [showContent, setShowContent] = useState(false);
  const handleShow = () => {
    setShowContent(!showContent);
  };
  const formatFirestoreTimestamp = (timestamp) => {
    const date = timestamp.toDate();

    const formattedDate = format(date, "yyyy-MM-dd HH:mm");

    return formattedDate;
  };
  return (
    <div onClick={handleShow} key={item.id} className="contentContainer">
      <h3>{item.title}</h3>
      <p>{formatFirestoreTimestamp(item.createdAt)}</p>
      <p>Tác giả: {item.author}</p>
      {item.sections && showContent ? (
        item.sections.map((section, index) => (
          <div key={index}>
            <h4>{section.heading}</h4>
            <div dangerouslySetInnerHTML={{ __html: section.content }}></div>
            {section.images != "" && (
              <div className="imageBlock">
                <img
                  key={index}
                  src={section.images}
                  alt={`Section Image ${index}`}
                  width="300"
                />
              </div>
            )}
          </div>
        ))
      ) : (
        <></>
      )}
    </div>
  );
});
