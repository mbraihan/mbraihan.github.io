/**
 * Uiverse “heavy-dog-14” switch
 * -- dark = unchecked (default) ,  light = checked
 */
export default function ThemeSwitch({ dark, setDark }) {
    return (
        <label className="ui-switch">
            <input
                type="checkbox"
                checked={!dark}
                onChange={() => setDark(d => !d)}
            />
        <div className="slider">
            <div className="circle" />
        </div>

        </label>
    );
}
