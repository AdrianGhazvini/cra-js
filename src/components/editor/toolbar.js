import PropTypes from 'prop-types';
import { StyledEditorToolbar } from 'src/components/editor/styles';

// ----------------------------------------------------------------------

const HEADINGS = ['Heading 1', 'Heading 2', 'Heading 3', 'Heading 4', 'Heading 5', 'Heading 6'];

export const formats = [
  'align',
  'background',
  'blockquote',
  'bold',
  'bullet',
  'code',
  'code-block',
  'color',
  'direction',
  'font',
  'formula',
  'header',
  'image',
  'indent',
  'italic',
  'link',
  'list',
  'script',
  'size',
  'strike',
  'table',
  'underline',
  'video',
];

export default function Toolbar({ id, isSimple, ...other }) {
  return (
    <StyledEditorToolbar {...other}>
      <div id={id}>
        <div className="ql-formats">
          <select className="ql-header" defaultValue="">
            {HEADINGS.map((heading, index) => (
              <option key={heading} value={index + 1}>
                {heading}
              </option>
            ))}
            <option value="">Normal</option>
          </select>
        </div>

        <div className="ql-formats">
          <button type="button" className="ql-bold" />
          <button type="button" className="ql-italic" />
          <button type="button" className="ql-underline" />
          <button type="button" className="ql-strike" />
        </div>

        {!isSimple && (
          <div className="ql-formats">
            <select className="ql-color" />
            <select className="ql-background" />
          </div>
        )}

        <div className="ql-formats">
          <button type="button" className="ql-list" value="ordered" />
          <button type="button" className="ql-list" value="bullet" />
          {!isSimple && <button type="button" className="ql-indent" value="-1" />}
          {!isSimple && <button type="button" className="ql-indent" value="+1" />}
        </div>
      </div>
    </StyledEditorToolbar>
  );
}

Toolbar.propTypes = {
  id: PropTypes.string,
  isSimple: PropTypes.bool,
};
