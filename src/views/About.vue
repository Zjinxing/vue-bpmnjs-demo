<template>
  <div class="about">
    <div ref="container" class="container"></div>
    <div class="btns">
      <el-upload
        action=""
        class="upload"
        :before-upload="openBpmn">
        <el-button type="primary" size="mini">打开文件</el-button>
      </el-upload>
      <a :href="bpmnData" :download="bpmnName" title="下载为BPMN diagram" class="el-button el-button--primary el-button--mini">下载为BPMN</a>
      <a :href="svgData" :download="svgName" title="下载为SVG" class="el-button el-button--primary el-button--mini">下载为SVG</a>
    </div>
  </div>
</template>

<script>
import BpmnModeler from 'bpmn-js/lib/Modeler'
import diagramXML from '../resource/newDiagram.bpmn'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'

export default {
  data () {
    return {
      modeler: null,
      bpmnData: '',
      bpmnName: 'diagram.bpmn',
      svgData: '',
      svgName: 'diatram.svg'
    }
  },
  mounted () {
    const container = this.$refs.container
    this.modeler = new BpmnModeler({
      container: container
    })
    this.openDiagram(diagramXML)
    this.modeler.on('commandStack.changed', () => {
      this.modeler.saveSVG((err, svg) => {
        if (err) {
          console.log('error: ', err)
        } else {
          // console.log('bpmnData: ', svg)
          const encodedData = encodeURIComponent(svg)
          this.svgData = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData,
          this.svgName = 'diagram.svg'
        }
      })
      this.modeler.saveXML({ format: true }, (err, xml) => {
        console.log('xml', xml)
        const encodedData = encodeURIComponent(xml)
        this.bpmnData = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData,
        this.bpmnName = 'diagram.bpmn'
      })
    })
  },
  methods: {
    openDiagram (xml) {
      this.modeler.importXML(xml, err => {
        if (err) {
          console.log('error: ', err)
        } else {
          console.log('success!')
        }
      })
    },
    openBpmn (file) {
      const reg = /.bpmn$/
      const fileName = file.name
      if (!reg.test(fileName)) {
        alert('只能打开bpmn格式的文件')
        return false
      }
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = (e) => {
        console.log('文件内容', e.target.result)
        this.openDiagram(e.target.result)
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 75vh;
  outline: 1px dashed #f00;
  visibility: visible;
}
.upload {
  display: inline-block;
  margin-right: 10px;
}
a {
  text-decoration: none
}
</style>
