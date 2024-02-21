'use client'



import { CiDark, CiLight } from "react-icons/ci"
import { useEffect, useState } from "react"
import { Switch } from "@headlessui/react"

const ThemeProvider = () => {
    // enabled ==='dark'
    const [enabledDark, setEnabledDark] = useState(false)
    useEffect(() => {
        if(enabledDark){
            
        }
      

    }, [enabledDark]);
    return (<>
        <Switch
            checked={enabledDark}
            onChange={setEnabledDark}
            className={`bg-bg text-text relative inline-flex h-8 w-14 items-center rounded-full hover:ring-2 hover:ring-primary transition`}
        >
            <span className="sr-only">Enable notifications</span>
            <span
                className={`${enabledDark ? 'translate-x-7' : 'translate-x-1'
                    } h-6 w-6 transform rounded-full bg-white/20 transition flex items-center justify-center`}
            >
                {enabledDark ? <CiDark /> : <CiLight />}
            </span>
        </Switch>
    </>
    )
}

export default ThemeProvider