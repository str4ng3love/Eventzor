
import NotificationsTest from "./components/dynamic/Notifications/NotificationsTest";



export default async function Home() {

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh_-_6rem)]">

      <span className="skew-y-2 p-1 bg-gradient-to-t from-primary to-secondary rounded-2xl animate-bounce">
        <h2 className="uppercase text-2xl font-bold p-4 bg-primary rounded-xl">
          under construction
        </h2>
      </span>
      <div>

        to do:
        <ul>
          <li>
            - orders page X
          </li>
          <li>
            - notifications X
          </li>
          <li>
            - user page X
          </li>
          <li>
            - search X
          </li>
          <li>
            - landing page 
          </li>
          <li>
            - footer X
          </li>
          <li>
            - background animations -
          </li>
          <li>
            - improve portal animation and positioning -
          </li>
        </ul>
      </div>


      <NotificationsTest />

    </div>


  );
}
