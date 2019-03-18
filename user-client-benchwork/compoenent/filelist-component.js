import React from 'react'

const FileItemComponent = ({
  fileslisttypetwo,
  fileslisttypeone,
  deleteFile,
  onChange,
  radioValue1,
  radioValue2,
  onRadioChange,
  submitFile,
  displayErrors
}) => (
  <div className='container'>
    <form
      encType='multipart/form-data'
      className={displayErrors ? 'was-validated' : ''}
      noValidate
    >
      <div className='container'>
        <h4>Step 1</h4>
        <input type='file' name='selectedFile' onChange={onChange} required />
        <br />
        <br />
        <h4>Step 2</h4>
        <div className='custom-control custom-radio'>
          <input
            className='custom-control-input'
            type='radio'
            name='filetype'
            id='filetypetwo'
            value={radioValue1}
            onChange={onRadioChange}
            required
          />
          <label className='custom-control-label' htmlFor='filetypetwo'>
            Type Two File
          </label>
        </div>
        <div className='custom-control custom-radio'>
          <input
            className='custom-control-input'
            type='radio'
            name='filetype'
            id='filetypeone'
            value={radioValue2}
            onChange={onRadioChange}
            required
          />
          <label className='custom-control-label' htmlFor='filetypeone'>
            Type One File
          </label>
        </div>
        <br />
        <button
          type='button'
          className='btn btn-danger btn-lg'
          onClick={() => submitFile()}
        >
          Submit
        </button>
      </div>
      <br />
      <h3>Files list</h3>
      <table>
        <thead>
          <tr>
            <th>Type two documents</th>
          </tr>
        </thead>
        <tbody>
          {fileslisttypetwo.map((row, index) => (
            <tr key={index}>
              <td>
                <a
                  href={`http://yourport/downloads?test=${row.filename}`}
                  download
                >
                  {row.filename}.{row.extensionfile}
                </a>
              </td>
              <td>
                <button
                  className='btn btn-secondary btn-sm'
                  type='button'
                  onClick={() => deleteFile(`${row.filename}`)}
                >
                  DELETE
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <thead>
          <tr>
            <th>Type One documents</th>
          </tr>
        </thead>
        <tbody>
          {fileslisttypeone.map((row, index) => (
            <tr key={index}>
              <td>
                <a
                  href={`http://yourport/downloads?test=${row.filename}`}
                  download
                >
                  {row.filename}.{row.extensionfile}
                </a>
              </td>
              <td>
                <button
                  className='btn btn-secondary btn-sm'
                  type='button'
                  onClick={() => deleteFile(`${row.filename}`)}
                >
                  DELETE
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </form>
  </div>
)

export default FileItemComponent
