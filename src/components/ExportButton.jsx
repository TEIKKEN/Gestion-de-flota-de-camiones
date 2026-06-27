import '../styles/ExportButton.css'

function toCSV(rows, headers) {
  const lines = [
    headers.join(','),
    ...rows.map(r => headers.map(h => `"${(r[h] ?? '').toString().replace(/"/g, '""')}"`).join(','))
  ]
  return lines.join('\n')
}

function download(content, filename) {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function ExportButton({ transactions, trucks }) {
  function handleExport() {
    // Hoja 1: todos los movimientos
    const headers = ['id','date','truck','type','category','description','client','amount']
    const csv = toCSV(transactions, headers)
    download(csv, `flota_movimientos_${new Date().toISOString().split('T')[0]}.csv`)
  }

  return (
    <button className="export-btn" onClick={handleExport} title="Exportar a CSV para Excel">
      📥 Exportar CSV
    </button>
  )
}

export default ExportButton