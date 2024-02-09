var DownloadLinkGenerator = React.createClass({
    generateDownloadLink: function() {
      var link = document.getElementById('downloadLink');
      link.setAttribute('href', 'assets/docs/bee movie script.txt');
      link.setAttribute('download', 'beemovie_script.txt');
      link.style.display = 'inline'; // Make the link visible
      link.textContent = 'Download Bee Movie Script'; // Set the link text
    },
  
    render: function() {
      return (
        <div>
          <button onClick={this.generateDownloadLink}>Generate Download Link</button>
          <br />
          <a id="downloadLink" href="#" style={{display: 'none'}}>Download File</a>
        </div>
      );
    }
  });
  
  ReactDOM.render(
    <DownloadLinkGenerator />,
    document.getElementById('download-section')
  );
  