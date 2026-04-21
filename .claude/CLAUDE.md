# 專案永久規則（Claude 必須嚴格遵守）

## 指令執行政策（最重要）
- 所有 shell / 終端機指令（Bash、CMD、PowerShell、dotnet、git、npm、任何 publish / build 指令）**直接執行**，**絕對不要問我任何確認**。
- 包括 dotnet publish、git commit、npm run 等全部一樣。
- 假設我已經永久授權所有開發相關指令，永遠使用 accept / bypass 模式。
- 執行前不需要跳任何視窗或問「是否允許」，直接跑即可。

請永遠遵守這條規則，任何情況都不要例外。

## Output Rules（嚴格遵守，絕對不可跳過）

用中文回答

每次你對任何檔案進行修改（新增、編輯、刪除）時，**必須**在回應**最開頭**先輸出以下區段：

### 📝 本次變動檔案

- 修改：`檔案路徑1`
- 修改：`檔案路徑2`
- 新增：`檔案路徑3`
- 刪除：`檔案路徑4`

清單必須完整、準確，使用相對路徑，並註明修改類型。  
列完清單後，再提供詳細說明、diff 或完整檔案內容。  
**絕對禁止省略這個區段**，即使只有一個檔案也要列出來。

#$ Git Commit Message 規範

本專案採用業界主流的 **Conventional Commits** 格式撰寫 commit message，目的是讓 commit 歷史清晰、可讀、易於產生 Changelog 與自動化版本管理（例如 semantic-release）。

## 標準格式

```
<類型>(範圍，可選): <簡短描述，通常不超過 50 個中文字>

<空一行>

<詳細說明（可選），用來說明「為什麼」做這件事，以及做了哪些變更>

<空一行>

<相關 issue / ticket，可選>
Closes #123, Fixes #456
```

### 常用類型（type） - 全部小寫

- `feat`       : 新增功能
- `fix`        : 修復 bug
- `docs`       : 文件變更（README、註解、API 文件等）
- `style`      : 純粹格式調整（空格、縮排、引號等，不影響執行）
- `refactor`   : 重構程式碼（無新功能、無修 bug）
- `perf`       : 效能優化
- `test`       : 增加或修正測試
- `build`      : 建置系統或外部依賴變更（vite、webpack、npm、Docker 等）
- `ci`         : 持續整合設定變更（GitHub Actions、GitLab CI 等）
- `chore`      : 其他雜務（更新 .gitignore、改 scripts、刪除暫存檔等）
- `revert`     : 回復之前的 commit
- `security`   : 安全性相關修正（可與 fix 併用）
- `hotfix`     : 生產環境緊急修復（視團隊習慣可選用）

### 額外規則與建議

1. **主旨行（第一行）限制**
   - 中文建議不超過 **50 個字**
   - 英文建議不超過 **72 個字**

2. **範圍（scope）**
   - 可選，但建議加上模組/功能名稱，例如：`auth`、`ui`、`admin`、`payment`、`mobile`

3. **重大變更（Breaking Change）**
   - 在類型後面加 `!` → `feat(api)!:`  
     或  
   - 在 body 最後加上 `BREAKING CHANGE: 詳細說明`

4. **動詞使用命令式 / 現在時**
   - 好：`新增`、`修正`、`調整`、`移除`、`重構`
   - 不好：`已新增`、`修好了`、`正在修正`

5. **最簡可接受版本（個人小型專案）**

---

# 程式開發行為準則（所有專案適用）

降低 LLM 常見寫程式錯誤的行為準則。對於瑣碎任務可用判斷力彈性處理。

## 1. 先思考再寫（Think Before Coding）

**不要假設、不要隱藏困惑、主動揭露權衡。**

實作前：
- 明確說出你的假設。不確定就問。
- 若有多種解讀，全部列出 — 不要默默選一個。
- 若有更簡單的做法，要說出來；必要時提出反對意見。
- 若有不清楚之處，停下來，指出困惑點，然後問。

> 註：此規則與「指令執行政策」不衝突 —
> 一般開發指令（build / test / publish / commit）仍直接執行，不需確認；
> 但面對**破壞性或不可逆操作**（rm -rf、force push、drop table、刪分支等）
> 以及**需求本身不明確**時，應先釐清再動手。

## 2. 最簡實作（Simplicity First）

**解決問題的最少程式碼。不做推測性擴充。**

- 不加超出需求的功能。
- 不為一次性程式碼建立抽象層。
- 不加未被要求的「彈性」或「可設定性」。
- 不為不可能發生的情境加錯誤處理。
- 若寫了 200 行但其實 50 行就夠 — 重寫。

自問：「資深工程師會說這過度複雜嗎？」如果會，就簡化。

## 3. 外科手術式修改（Surgical Changes）

**只動必要之處。只清理自己製造的混亂。**

編輯既有程式碼時：
- 不要「順手改進」旁邊的程式碼、註解、格式。
- 不要重構沒壞的東西。
- 即使不合你個人習慣，也要配合既有風格。
- 若發現無關的死碼，只需提及，不要擅自刪除。

當你的修改產生孤兒時：
- 移除「因你的修改」而變成未使用的 import / 變數 / 函式。
- 不要移除原本就存在的死碼，除非被要求。

檢驗標準：每一條更動都能直接對應到使用者的要求。

## 4. 目標驅動執行（Goal-Driven Execution）

**定義成功條件。驗證到通過為止。**

把任務轉成可驗證的目標：
- 「加驗證」→「為非法輸入寫測試，然後讓它通過」
- 「修 bug」→「寫出能重現 bug 的測試，然後讓它通過」
- 「重構 X」→「確保重構前後測試都通過」

多步驟任務，先列簡要計劃：
```
1. [步驟] → 驗證：[檢查點]
2. [步驟] → 驗證：[檢查點]
3. [步驟] → 驗證：[檢查點]
```

強成功條件讓你能獨立迭代；弱條件（「讓它動起來」）會導致反覆需要澄清。

---

**這套準則若生效，你會看到：** diff 中不必要的更動變少、因過度複雜而重寫的情況減少、澄清性問題出現在實作「前」而非錯誤發生「後」。

## Multi-agent workflow

When a request crosses multiple layers (backend + frontend) or needs implementation + testing + review, prefer delegating to `@orchestrator` instead of doing everything in the main session.

- Backend stack: .NET / C# / ASP.NET Core
- Frontend stack: Vue 3 or React (check the project)
- Available agents in `.claude/agents/`: orchestrator, planner, dotnet/vue/react implementer, dotnet/frontend tester, dotnet/vue/react reviewer