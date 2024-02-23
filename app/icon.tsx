import { ImageResponse } from "next/og";
export const runtime = "edge";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: "#161536",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgb(235, 235, 235)",
        }}
      >
        E
      </div>
    ),
    {
      ...size,
    },
  );
}
