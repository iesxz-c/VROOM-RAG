
const PSbutton = ({text, onclick}) => {
  return (
    <button className="prompt-button"
    onClick={onclick}
    >
      {text}
    </button>
  )
}

export default PSbutton