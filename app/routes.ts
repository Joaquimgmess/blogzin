import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("gerar","routes/gerar.tsx"),
    route("posts/:postId","routes/posts.$postId.tsx")
] satisfies RouteConfig;
