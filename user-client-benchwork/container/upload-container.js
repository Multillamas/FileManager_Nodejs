import React, { Component } from 'react'
import axios from '../service/api-service'
import FileItemComponent from '../component/filelist-component'

class UploadContainer extends Component {
  constructor () {
    super()
    this.state = {
      selectedFile: '',
      uploadStatus: '',
      displayErrors: false,
      fileslistypetwo: [],
      fileslistypeone: [],
      selectedOption: '',
      fileownerid: '',
      typeoffile: [
        { value: 0, label: 'File of Type One' },
        { value: 1, label: 'File of Type Two' }
      ]
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.getFilesListTwo = this.getFilesListTwo.bind(this)
    this.getFilesListOne = this.getFilesListOne.bind(this)
    this.deleteFile = this.deleteFile.bind(this)
    this.onRadioChange = this.onRadioChange.bind(this)
  }

  componentDidMount () {
    this.getFilesListTwo()
    this.getFilesListOne()
    this.forceUpdate()
  }

  onRadioChange (e) {
    this.setState({
      selectedOption: e.currentTarget.value
    })
  }
  getFilesListTwo () {
    axios
      .get('/academicfiles', {
        params: {
          fileownerid: this.props.infoFileOwner
        }
      })
      .then(response => {
        this.setState({ fileslisttypetwo: response.data })
      })
  }
  getFilesListOne () {
    axios
      .get('/identityfiles', {
        params: {
          fileownerid: this.props.infoFileOwner
        }
      })
      .then(response => {
        this.setState({ fileslisttypeone: response.data })
      })
  }

  onChange (e) {
    switch (e.target.name) {
      case 'selectedFile':
        this.setState({ selectedFile: e.target.files[0] })
        break
      default:
        this.setState({ [e.target.name]: e.target.value })
    }
  }
  deleteFile (fileName) {
    axios
      .post('deletes', {
        fileURL: fileName
      })
      .then(response => {
        this.getFilesListTwo()
        this.getFilesListOne()
        this.setState({ uploadStatus: response.data })
      })
  }

  onSubmit () {
    let fileownerid = this.props.infoFileOwner

    const FormData = require('form-data')
    let form = new FormData()

    const { selectedFile, selectedOption } = this.state

    if (this.state.selectedOption === '') {
      this.setState({ displayErrors: true })
    } else if (this.state.selectedFile === '') {
      this.setState({ uploadStatus: 'No file selected' })
    } else {
      form.append('selectedOption', selectedOption)
      form.append('selectedFile', selectedFile)
      form.append('fileownerid', fileownerid)
      axios.post('/', form).then(response => {
        this.setState({ uploadStatus: response.data })
        this.getFilesListTwo()
        this.getFilesListOne()
      })

      this.setState({ selectedFile: '' })
      this.setState({ displayErrors: false })
    }
  }
  render () {
    return (
      <div className='border border-danger'>
        <div className='row justify-content-center'>
          <h3 className='text-danger'>Add Files</h3>
        </div>
        <div className='alert alert-secondary' role='alert'>
          {this.state.uploadStatus}
        </div>

        <FileItemComponent
          fileslisttypetwo={this.state.fileslisttypetwo}
          fileslisttypeone={this.state.fileslisttypeone}
          deleteFile={this.deleteFile}
          onChange={this.onChange}
          radioValue1={this.state.typeoffile[1].value}
          radioValue2={this.state.typeoffile[0].value}
          onRadioChange={this.onRadioChange}
          selectedOption={this.state.selectedOption}
          submitFile={this.onSubmit}
          fileownerid={this.props.infoFileOwner}
          displayErrors={this.state.displayErrors}
        />
      </div>
    )
  }
}
export default UploadContainer
