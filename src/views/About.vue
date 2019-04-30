<template>
  <div class="about">
    <div class="wrapper">
      <div ref="container" class="container"></div>
      <div ref="panel" class="panel"></div>
    </div>
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
import propertiesPanelModule from 'bpmn-js-properties-panel'
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'
import diagramXML from '../resource/newDiagram.bpmn'
import customTranslate from '../translate/customerTranslate.js'
import resizeAllModule from 'bpmn-js-nyan/lib/resize-all-rules'
import colorPickerModule from 'bpmn-js-nyan/lib/color-picker'
import nyanDrawModule from 'bpmn-js-nyan/lib/nyan/draw'
// import nyanPaletteModule from 'bpmn-js-nyan/lib/nyan/palette'
// import customModule from '../customElements'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import 'diagram-js/assets/diagram-js.css'

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
    const panel = this.$refs.panel
    const customTranslateModule = {
      translate: ['value', customTranslate]
    }
    this.modeler = new BpmnModeler({
      container: container,
      propertiesPanel: {
        parent: panel
      },
      additionalModules: [
        propertiesPanelModule,
        propertiesProviderModule,
        customTranslateModule,
        resizeAllModule,
        colorPickerModule,
        nyanDrawModule,
        // nyanPaletteModule
        // customModule
      ],
      moddleExtensions: {
        camunda: camundaModdleDescriptor
      }
    })
    this.openDiagram(diagramXML)
    this.modeler.on('commandStack.changed', () => {
      this.modeler.saveSVG((err, svg) => {
        if (err) {
          console.log('error: ', err)
        } else {
          // console.log('bpmnData: ', svg)
          const encodedData = encodeURIComponent(svg)
          this.svgData = `data:application/bpmn20-xml;charset=UTF-8,${encodedData}`
          this.svgName = 'diagram.svg'
        }
      })
      this.modeler.saveXML({ format: true }, (err, xml) => {
        if (err) {
          console.log('error: ', err)
          return
        }
        const encodedData = encodeURIComponent(xml)
        this.bpmnData = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
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
@import url('./about/about.css');
.wrapper {
  display: flex;
  width: 100%;
  height: 80vh;
  .container {
    flex: 1;
    outline: 1px dashed #ff8888;
    height: 100%;
  }
  .panel {
    width: 300px;
    height: 100%;
    outline: 1px dashed #ff8888;
    overflow-y: scroll;
  }
}
.upload {
  display: inline-block;
  margin-right: 10px;
}
a {
  text-decoration: none
}
</style>
