import type { Route } from "../+types/root";

export async function loader({ request }: Route.LoaderArgs) {
    return  [1,2,3,4,5,6,7,8,9,10]
}




export default function Gerar() {
  return <div>Gerar</div>;
}   