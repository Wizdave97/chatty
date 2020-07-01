import React from 'react';
import { Button } from '@airtable/blocks/ui'

const ButtonBadge = (props) => {
    
    return (
        <div className="relative p-0 m-0">
            {props.children ? <Button {...props}>{props.children}</Button> : <Button {...props} />}
            {props.badge <= 0 ? null : <span className="absolute top-0 left-0 text-xs text-white text-center font-bold bg-green-700 rounded-full w-4 h-4">{props.badge}</span>}
        </div>

    )
}

export default ButtonBadge;