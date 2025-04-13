<div class="b3-dialog__content">
  {#if i18n !== undefined}
    <div class="kntsy-markdown-btn-groups">
      <input
      type="file"
      id="fileInput"
      accept=".json"
      on:change={submitJson}
      class="kntsy-upload-input"
    />
    <label for="fileInput" class="kntsy-btn kntsy-upload-btn">{i18n.select}</label>
    <button
      class="kntsy-btn kntsy-copy-btn"
      on:click={copyContent}
    >
    {i18n.copy}
    </button>
    </div>
    <div class="kntsy-markdown-container">
      <h2 class="kntsy-markdown-lable">{i18n.labelTips}</h2>
      <div
        id="content-to-copy"
        class="kntsy-markdown-content"
      >
        {markdownContent}
      </div>
    </div>
    <div class="kntsy-error-msg">{errorMessage}</div>
    {/if}
</div>

<script lang="ts">
  export let i18n;
  import { showMessage } from "siyuan";
  // console.log("siyuan", window.siyuan)
  // console.log('i18n', i18n);

  interface Item {
    chapter: string;
    text: string;
    time: number;
    note: string;
  }

  interface MergedItem {
    chapter: string;
    list: Item[];
  }

  let markdownContent = "";
  let errorMessage = "";



  // 转换格式
  const jsonToMarkdown = (json: any): string => {
    let markdown = "";
    // 设置标题
    if (typeof json === "object" && json !== null) {
      markdown += `## 《${json.title}》标记和想法 \n`;
      const entries = mergeData(json.entries);
      // console.log("合并数据后", entries);
      markdown = notesItem(entries);
    }
    return markdown;
  };
  // 合并章节条目
  const mergeData = (arr: Item[]): any => {
    const result: MergedItem[] = [];
    const map = new Map<string, MergedItem>();
    arr.forEach((item) => {
      const key = item.chapter;
      if (!map.has(key)) {
        const newItem: MergedItem = {
          chapter: key,
          list: [],
        };
        result.push(newItem);
        map.set(key, newItem);
      }
      map.get(key)?.list.push(item);
    });
    return result;
  };
  // 打印条目
  const notesItem = (notes: {
    chapter: string;
    list: MergedItem[];
  }): string => {
    let markdown = "";
    // console.log("打印条目", notes);
    if (Array.isArray(notes)) {
      notes.forEach((note) => {
        if (Array.isArray(note.list)) {
          // 章节标题
          markdown += `### ${note.chapter} \n`;
          // 章节下的标注和笔记
          // console.log("章节下的标注和笔记", note.list);
          note.list.forEach((items: MergedItem) => {
            // console.log("123", items);
            markdown += objectToMarkdown(items);
          });
        }
      });
    }
    return markdown;
  };
  // 章节下的笔记样式
  const objectToMarkdown = (obj: any): string => {
    let markdown = "";
    if (typeof obj === "object" && obj !== null) {
      let noteText = "";
      noteText = `<span data-type="text" style="font-size: 14px; color: var(--b3-font-color2);">
      ${formatTimestampToDate(obj.time)} ${
        obj.note && obj.note.length > 0 ? "：" + obj.note : ""
      }
      </span>`;
      markdown += `- ${obj.text} ${noteText}\n`;
    }
    return markdown;
  };
  // 格式化日期的方法
  const formatTimestampToDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  async function submitJson(e) {
    const target = e.target as HTMLInputElement;
    const file = target.files[0];
    if (!file) return;
    if (file) {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const jsonData = JSON.parse(e.target?.result as string);
          const md = jsonToMarkdown(jsonData);
          // console.log("转换效果\n", md);
          markdownContent = md;
          errorMessage = "";
        };
        reader.readAsText(file);
      } catch (error) {
        errorMessage = "文件读取或解析出错，请检查文件格式是否正确。";
        console.error("文件读取或解析出错:", error);
      }
    }
  }
  // 复制转换后的格式
  const copyContent = async () => {
    const contentDiv = document.getElementById("content-to-copy");
    if (contentDiv) {
      const range = document.createRange();
      range.selectNode(contentDiv);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
        try {
          await document.execCommand("copy");
          showMessage("内容已复制到剪贴板");
          window.siyuan.dialogs[0].destroy();
        } catch (err) {
          console.error("复制失败: ", err);
        }
        selection.removeAllRanges();
      }
    }
  };
</script>